import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Fake login: Store userId in localStorage
    localStorage.setItem('userId', '1');
    navigate('/dashboard'); // Navigate to dashboard after login
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Log In to TravelEase</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Log In</button>
      </form>
      <div className="text-center mt-3">
        <small>
          Don't have an account? <a href="/signup">Sign up</a>
        </small>
      </div>
    </div>
  );
}
