import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import Analytics from './pages/Analytics';
import TripForm from './pages/TripForm';
import CurrencyRates from './pages/CurrencyRates';
import EditTrip from './pages/EditTrip';
import TransactionDashboard from './pages/TransactionDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trip/new" element={<TripForm />} />
        <Route path="/trip/:tripId/edit" element={<TripForm />} />
        <Route path="/trip/:tripId" element={<TripDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/currency-rates" element={<CurrencyRates />} />
        <Route path="/trip/edit/:tripId" element={<EditTrip />} />
        <Route path="/transactions" element={<TransactionDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
