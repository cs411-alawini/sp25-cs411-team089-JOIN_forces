import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    homeCurrency: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // Simulate storing user
    const userId = Math.floor(Math.random() * 1000); // Mock user ID
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', form.username);
    localStorage.setItem('homeCurrency', form.homeCurrency);

    // Redirect
    navigate('/dashboard');
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">Sign Up for TravelEase</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="homeCurrency" className="form-label">Home Currency (e.g., USD, EUR)</label>
          <input
            type="text"
            name="homeCurrency"
            id="homeCurrency"
            className="form-control"
            value={form.homeCurrency}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-warning text-white w-100">
          Sign Up
        </button>
      </form>

      <div className="text-center mt-3">
        <small>
          Already have an account? <a href="/login">Log in</a>
        </small>
      </div>
    </div>
  );
}
