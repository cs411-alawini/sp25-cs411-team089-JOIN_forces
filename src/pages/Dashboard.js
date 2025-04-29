import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [originalTrips, setOriginalTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [topTrips, setTopTrips] = useState([]);
  const [frequentTravelers, setFrequentTravelers] = useState([]);
  const [archivedTrips, setArchivedTrips] = useState([]);
  const navigate = useNavigate();
  const userId = 1;

  const pastelColors = [
    '#FDEBD0', '#D6EAF8', '#D5F5E3', '#FCF3CF', '#F9EBEA', '#E8DAEF'
  ];

  useEffect(() => {
    if (!userId) return;

    fetch(`http://127.0.0.1:5050/api/trips?userId=${userId}`)
      .then(res => res.json())
      .then(tripList => {
        setTrips(tripList);
        setOriginalTrips(tripList);
      })
      .catch(err => console.error('Error loading trips data:', err));
  }, [userId]);

  const handleDelete = (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    fetch(`http://127.0.0.1:5050/api/trips/${tripId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete trip');
        return res.json();
      })
      .then(() => {
        setTrips(prev => prev.filter(t => t.TripID !== tripId));
        setOriginalTrips(prev => prev.filter(t => t.TripID !== tripId));
        toast.success('Trip deleted successfully!');
      })
      .catch((err) => toast.error(err.message));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setTrips(originalTrips.filter(t => t.TripName.toLowerCase().includes(value)));
  };

  const handleShowTopTrips = () => {
    fetch('http://127.0.0.1:5050/api/top-trips')
      .then(res => res.json())
      .then(data => {
        setTopTrips(data);
        setFrequentTravelers([]);
        setArchivedTrips([]);
      })
      .catch(err => console.error('Error fetching top trips:', err));
  };

  const handleShowFrequentTravelers = () => {
    fetch('http://127.0.0.1:5050/api/frequent-travelers')
      .then(res => res.json())
      .then(data => {
        setFrequentTravelers(data);
        setTopTrips([]);
        setArchivedTrips([]);
      })
      .catch(err => console.error('Error fetching frequent travelers:', err));
  };

  const handleShowArchivedTrips = () => {
    fetch('http://127.0.0.1:5050/api/archived-trips')
      .then(res => res.json())
      .then(data => {
        setArchivedTrips(data);
        setTrips([]);
        setTopTrips([]);
        setFrequentTravelers([]);
      })
      .catch(err => console.error('Error fetching archived trips:', err));
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="mb-4 d-flex justify-content-end">
        <Link to="/transactions">
          <button className="btn btn-outline-primary">Go to Transactions</button>
        </Link>
      </div>

      <h2 className="mb-4">Dashboard</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Your Trips</h4>
        <button className="btn btn-success" onClick={() => navigate('/trip/new')}>
          + Create Trip
        </button>
      </div>

      <div className="d-flex gap-3 mb-4">
        <button className="btn btn-outline-primary" onClick={handleShowTopTrips}>
          Show Expensive Trips
        </button>
        <button className="btn btn-outline-secondary" onClick={handleShowFrequentTravelers}>
          Show Frequent Travelers
        </button>
        <button className="btn btn-outline-danger" onClick={handleShowArchivedTrips}>
          Show Archived Trips
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by trip name..."
        className="form-control mb-4"
        value={search}
        onChange={handleSearch}
      />

      {/* Active Trips */}
      {trips.length > 0 && (
        <div className="row">
          {trips.map((trip, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={trip.TripID}>
              <div
                className="card h-100"
                style={{
                  backgroundColor: pastelColors[index % pastelColors.length],
                  borderRadius: '16px',
                  border: 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.00)'}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold border-bottom pb-2">{trip.TripName}</h5>
                  <p className="card-subtitle mb-3 text-muted">
                    {trip.StartDate} – {trip.EndDate}
                  </p>

                  <div className="d-flex flex-column gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill"
                      onClick={() => navigate(`/trip/${trip.TripID}`)}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                      onClick={() => navigate(`/trip/edit/${trip.TripID}`)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill"
                      onClick={() => handleDelete(trip.TripID)}
                    >
                      <i className="bi bi-trash3 me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archived Trips */}
      {archivedTrips.length > 0 && (
        <div className="mt-5">
          <h4>Archived Trips</h4>
          <div className="row">
            {archivedTrips.map((trip, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={trip.ArchivedTripID}>
                <div
                  className="card h-100 bg-light"
                  style={{
                    borderRadius: '16px',
                    border: '1px dashed #aaa',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.00)'}
                >
                  <div className="card-body">
                    <h5 className="card-title fw-bold border-bottom pb-2">{trip.TripName}</h5>
                    <p className="card-subtitle mb-2 text-muted">
                      {trip.StartDate} – {trip.EndDate}
                    </p>
                    <p className="small text-muted">Deleted at: {trip.DeletedAt?.slice(0, 10)}</p>
                    <p className="small">{trip.Description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Trips */}
      {topTrips.length > 0 && (
        <div className="mt-5">
          <h4>Top 3 Most Expensive Trips</h4>
          <ul className="list-group">
            {topTrips.map((trip, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                {trip.TripName}
                <span className="badge bg-primary rounded-pill">${trip.TotalSpent}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Frequent Travelers */}
      {frequentTravelers.length > 0 && (
        <div className="mt-5">
          <h4>Frequent Travelers (Users with more than 1 trip)</h4>
          <ul className="list-group">
            {frequentTravelers.map((user, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                {user.Username}
                <span className="badge bg-success rounded-pill">{user.TripCount} Trips</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
