import React from 'react';
import { Link } from 'react-router-dom';
// import heroImage from '../assets/hero-image.png'; // replace with your actual image path

export default function Home() {
  return (
    <div className="container py-5">
      {/* Nav */}
      <nav className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="text-primary fw-bold">TravelEase</h1>
        <div className="d-flex gap-4 align-items-center">
          <a href="#features" className="text-decoration-none text-dark">Features</a>
          <a href="#about" className="text-decoration-none text-dark">About</a>
          <a href="#contact" className="text-decoration-none text-dark">Contact</a>
          <Link to="/login">
            <button className="btn btn-outline-primary">Log In</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h2 className="display-5 fw-bold mb-3">Smart Travel Itinerary & Expense Tracker</h2>
          <p className="text-muted mb-4">Plan, track, and budget your trips effortlessly. All your travel needs in one beautiful app.</p>
          <div className="d-flex gap-3">
            <Link to="/signup">
              <button className="btn btn-warning text-white">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-outline-primary">Log In</button>
            </Link>
          </div>
        </div>
        <div className="col-md-6 text-center">
          {/* <img src={heroImage} alt="Travel" className="img-fluid" style={{ maxWidth: '300px' }} /> */}
        </div>
      </div>

      {/* Features Section */}
      <div id="features">
        <h3 className="text-center fw-bold mb-4">Key Features</h3>
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="border rounded p-3 bg-light">
              <strong className="text-primary">Smart Itinerary</strong>
              <p className="text-muted">Store all trip details in one place – flights, hotels, activities and more.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="border rounded p-3 bg-light">
              <strong className="text-warning">Expense Tracking</strong>
              <p className="text-muted">Categorize and monitor your travel expenses with real-time spending reports.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="border rounded p-3 bg-light">
              <strong className="text-primary">Currency Conversion</strong>
              <p className="text-muted">Automatically convert and track expenses across multiple currencies in real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
