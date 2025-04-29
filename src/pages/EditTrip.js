// src/components/EditTrip.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState({
    TripName: '',
    StartDate: '',
    EndDate: '',
    Description: '',
  });

  // Fetch trip details when component loads
  useEffect(() => {
    fetch(`http://127.0.0.1:5050/api/trips/${tripId}`)
      .then(res => res.json())
      .then(data => setTrip(data))
      .catch(err => alert('Failed to load trip details'));
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:5050/api/trips/${tripId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip),
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => navigate('/dashboard'))
      .catch(err => alert(err.message));
  };

  return (
    <div className="container py-5">
      <h2>Edit Trip</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Trip Name</label>
          <input type="text" className="form-control" name="TripName" value={trip.TripName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input type="date" className="form-control" name="StartDate" value={trip.StartDate} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input type="date" className="form-control" name="EndDate" value={trip.EndDate} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="Description" value={trip.Description} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
