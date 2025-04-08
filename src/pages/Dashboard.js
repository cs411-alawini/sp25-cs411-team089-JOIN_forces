import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [totalSpent, setTotalSpent] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [sharedTripIds, setSharedTripIds] = useState([]);
  const [aboveAverage, setAboveAverage] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch all analytics and trip data
  useEffect(() => {
    Promise.all([
      fetch(`/api/trips?userId=${userId}`).then(res => res.json()),
      fetch(`/api/analytics/total-spent?userId=${userId}`).then(res => res.json()),
      fetch(`/api/analytics/top-category?userId=${userId}`).then(res => res.json()),
      fetch(`/api/analytics/shared-trips?userId=${userId}`).then(res => res.json()),
      fetch(`/api/analytics/above-average?userId=${userId}`).then(res => res.json()),
    ])
    .then(([tripList, spentList, categoryList, sharedList, aboveAvgResult]) => {
      setTrips(tripList);
      setTotalSpent(spentList);
      setTopCategories(categoryList);
      setSharedTripIds(sharedList.map(t => t.TripID)); // store just TripIDs
      setAboveAverage(aboveAvgResult?.isAboveAverage || false);
    })
    .catch(err => console.error('Error loading dashboard data:', err));
  }, [userId]);

  // Helpers to find trip-related data
  const getTotalSpent = (tripName) => {
    const match = totalSpent.find(t => t.TripName === tripName);
    return match ? `$${match.TotalSpentHomeCurrency.toFixed(2)}` : '—';
  };

  const getTopCategory = (tripName) => {
    const match = topCategories.find(t => t.TripName === tripName);
    return match ? match.CategoryName : '—';
  };

  const isShared = (tripId) => sharedTripIds.includes(tripId);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Dashboard</h2>

      {/* Above-Average Alert */}
      {aboveAverage && (
        <div className="alert alert-warning text-center">
          💸 You’ve spent more than the average user!
        </div>
      )}

      {/* Header and Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Your Trips</h4>
        <button className="btn btn-success" onClick={() => navigate('/trip/new')}>
          + Create Trip
        </button>
      </div>

      {/* Trip Cards */}
      <div className="row">
        {trips.map((trip) => (
          <div className="col-md-4 mb-4" key={trip.TripID}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between">
                  {trip.TripName}
                  {isShared(trip.TripID) && <span title="Shared Trip">👥</span>}
                </h5>
                <p className="card-subtitle mb-2 text-muted">
                  {trip.StartDate} – {trip.EndDate}
                </p>
                <p className="mb-1">
                  💰 <strong>Total Spent:</strong> {getTotalSpent(trip.TripName)}
                </p>
                <p className="mb-3">
                  🏷 <strong>Top Category:</strong> {getTopCategory(trip.TripName)}
                </p>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate(`/trip/${trip.TripID}`)}
                >
                  View Trip
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
