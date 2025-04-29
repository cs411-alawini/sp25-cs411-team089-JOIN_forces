import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function TransactionDashboard() {
  const [tripId, setTripId] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);

  // Fetch active users when the component mounts (GET request)
  fetch('http://127.0.0.1:5050/api/promote_active_trip_users', {
    method: 'GET', // or 'POST' based on the method you're calling
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      console.log(res);  // Log the raw response
      return res.json();  // This will throw an error if the response is not valid JSON
    })
    .then((data) => {
      console.log(data);  // Handle the data here
      if (data.active_users) {
        setActiveUsers(data.active_users); // Set the active users from the response
      }
    })
    .catch((err) => {
      console.error('Error fetching active users:', err);
      toast.error('Failed to load active users');
    });
  

  // Handle creating booking and expense
  const handleCreateBookingAndExpense = () => {
    if (!tripId) {
      toast.error('Please enter a Trip ID');
      return;
    }

    fetch(`http://127.0.0.1:5050/api/create_booking_and_expense/${tripId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create booking and expense');
        return res.json();
      })
      .then(data => {
        toast.success(`Booking and setup expense created! Total Expenses: $${data.TotalExpenses}`);
      })
      .catch(err => {
        console.error('Error:', err);
        toast.error(err.message);
      });
  };

  const handlePromoteActiveUsers = () => {
    fetch('http://127.0.0.1:5050/api/promote_active_trip_users', {
      method: 'POST', // POST request to promote active users
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) {
          // If the response status is not OK, throw an error
          throw new Error('Failed to promote users');
        }
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          toast.success(data.message); // Display success message
        } else {
          toast.error('No message returned from the server');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        toast.error('Error promoting users: ' + err.message);
      });
  };  

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="mb-4 d-flex justify-content-end">
        <Link to="/dashboard">
          <button className="btn btn-outline-primary">Go to Dashboard</button>
        </Link>
      </div>

      <h2 className="mb-4">Transaction Dashboard</h2>

      <div className="mb-4">
        <h4>Create Booking and Setup Expense</h4>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Enter Trip ID"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleCreateBookingAndExpense}
          >
            Create Booking & Expense
          </button>
        </div>
      </div>

      <hr />

      <div className="mt-4">
        <h4>Promote Active Trip Users to Admin</h4>
        <button
          className="btn btn-success"
          onClick={handlePromoteActiveUsers}
        >
          Promote Active Users
        </button>
      </div>

      <hr />

      <div className="mt-4">
        <h4>Active Users</h4>
        {activeUsers.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.Username}</td>
                  <td>{user.Email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No active users found.</p>
        )}
      </div>
    </div>
  );
}
