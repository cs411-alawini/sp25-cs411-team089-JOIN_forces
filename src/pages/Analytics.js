import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Analytics() {
  const navigate = useNavigate();
  const [query1, setQuery1] = useState([]);
  const [query2, setQuery2] = useState([]);
  const [query3, setQuery3] = useState([]);
  const [query4, setQuery4] = useState([]);

  useEffect(() => {
    fetch('/api/analytics/total-spent').then(res => res.json()).then(setQuery1);
    fetch('/api/analytics/top-category').then(res => res.json()).then(setQuery2);
    fetch('/api/analytics/above-average').then(res => res.json()).then(setQuery3);
    fetch('/api/analytics/shared-trips').then(res => res.json()).then(setQuery4);
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Analytics Overview</h2>
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>← Back</button>

      {/* Query 1: Total Spent Per Trip (Converted) */}
      <section className="mb-5">
        <h5>Total Spent per Trip (Converted to Home Currency)</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Trip Name</th>
              <th>Username</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {query1.map((row, i) => (
              <tr key={i}>
                <td>{row.TripName}</td>
                <td>{row.Username}</td>
                <td>${parseFloat(row.TotalSpentHomeCurrency).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Query 2: Most Expensive Category Per Trip */}
      <section className="mb-5">
        <h5>Most Expensive Category per Trip</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Trip Name</th>
              <th>Category</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {query2.map((row, i) => (
              <tr key={i}>
                <td>{row.TripName}</td>
                <td>{row.CategoryName}</td>
                <td>${parseFloat(row.total_spent).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Query 3: Users Who Spent Above Average */}
      <section className="mb-5">
        <h5>Users Who Spent Above Average</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Username</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {query3.map((row, i) => (
              <tr key={i}>
                <td>{row.Username}</td>
                <td>${parseFloat(row.TotalSpent).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Query 4: Shared Trips (More Than 1 User) */}
      <section className="mb-5">
        <h5>Trips Shared by Multiple Users</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Trip Name</th>
              <th>Number of Users</th>
            </tr>
          </thead>
          <tbody>
            {query4.map((row, i) => (
              <tr key={i}>
                <td>{row.TripName}</td>
                <td>{row.NumUsers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
