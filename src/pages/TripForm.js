import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TripForm() {
  const { tripId } = useParams(); // for editing
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [trip, setTrip] = useState({
    TripName: '',
    StartDate: '',
    EndDate: '',
    Description: '',
  });

  useEffect(() => {
    if (tripId) {
      // Fetch existing trip details for editing
      fetch(`/api/trips/${tripId}`)
        .then((res) => res.json())
        .then((data) => setTrip(data));
    }
  }, [tripId]);

  const handleChange = (e) => {
    setTrip({
      ...trip,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = tripId ? 'PUT' : 'POST';
    const url = tripId ? `/api/trips/${tripId}` : `/api/trips`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...trip, userId }),
    })
      .then((res) => res.json())
      .then(() => {
        navigate('/dashboard');
      });
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">
        {tripId ? 'Edit Trip' : 'Create a New Trip'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Trip Name</label>
          <input
            type="text"
            className="form-control"
            name="TripName"
            value={trip.TripName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="StartDate"
            value={trip.StartDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            name="EndDate"
            value={trip.EndDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="Description"
            rows="3"
            value={trip.Description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success w-100">
          {tripId ? 'Update Trip' : 'Create Trip'}
        </button>
      </form>

      <div className="text-center mt-3">
        <small>
          <a href="/dashboard">← Back to Dashboard</a>
        </small>
      </div>
    </div>
  );
}
