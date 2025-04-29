import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TripDetail() {
  const { tripId } = useParams();
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencyRates, setCurrencyRates] = useState([]);
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState({ category: '', date: '' });

  const [form, setForm] = useState({
    Date: '',
    Amount: '',
    Currency: '',
    CategoryID: '',
    Description: '',
  });

  // Load trip info
  useEffect(() => {
    fetch(`/api/trips/${tripId}`).then(res => res.json()).then(setTrip);
    // fetch(`/api/expenses?tripId=${tripId}`).then(res => res.json()).then(setExpenses);
    // fetch(`/api/categories`).then(res => res.json()).then(setCategories);
    // fetch(`/api/currency-rates`).then(res => res.json()).then(setCurrencyRates);
    // fetch(`/api/trip-users?tripId=${tripId}`).then(res => res.json()).then(setMembers);
  }, [tripId]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      ...form,
      TripID: tripId,
      UserID: userId,
    };
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense),
    })
      .then(res => res.json())
      .then((saved) => {
        setExpenses([...expenses, saved]);
        setForm({ Date: '', Amount: '', Currency: '', CategoryID: '', Description: '' });
      });
  };

  const getCategoryName = (id) =>
    categories.find((cat) => cat.CategoryID === parseInt(id))?.CategoryName || '—';

  const convertAmount = (amount, currency, date) => {
    const userCurrency = localStorage.getItem('homeCurrency') || 'USD';
    const rate = currencyRates.find(
      (r) =>
        r.BaseCurrency === currency &&
        r.TargetCurrency === userCurrency &&
        r.Date <= date
    );
    return rate ? (amount * rate.Rate).toFixed(2) : null;
  };

  const filteredExpenses = expenses.filter((e) => {
    return (
      (!filter.category || e.CategoryID === parseInt(filter.category)) &&
      (!filter.date || e.Date === filter.date)
    );
  });

  if (!trip) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <h2>{trip.TripName}</h2>
      <p className="text-muted">{trip.StartDate} – {trip.EndDate}</p>
      <p>{trip.Description}</p>

      <div className="mb-4 d-flex justify-content-between">
        <h5>Expenses</h5>
        <button onClick={() => navigate('/analytics')} className="btn btn-outline-info">
          View Analytics
        </button>
      </div>

      {/* Filter */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </div>
      </div>

      {/* Expense Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Category</th>
            <th>Description</th>
            <th>Converted (Home)</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((e) => (
            <tr key={e.ExpenseID}>
              <td>{e.Date}</td>
              <td>${e.Amount}</td>
              <td>{e.Currency}</td>
              <td>{getCategoryName(e.CategoryID)}</td>
              <td>{e.Description}</td>
              <td>
                {convertAmount(e.Amount, e.Currency, e.Date)
                  ? `$${convertAmount(e.Amount, e.Currency, e.Date)}`
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Expense */}
      <h5 className="mt-5 mb-3">Add Expense</h5>
      <form onSubmit={handleAddExpense} className="row g-3">
        <div className="col-md-3">
          <input type="date" name="Date" className="form-control" value={form.Date} onChange={handleFormChange} required />
        </div>
        <div className="col-md-2">
          <input type="number" name="Amount" className="form-control" placeholder="Amount" value={form.Amount} onChange={handleFormChange} required />
        </div>
        <div className="col-md-2">
          <input type="text" name="Currency" className="form-control" placeholder="e.g., USD" value={form.Currency} onChange={handleFormChange} required />
        </div>
        <div className="col-md-3">
          <select name="CategoryID" className="form-select" value={form.CategoryID} onChange={handleFormChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <input type="text" name="Description" className="form-control" placeholder="Description" value={form.Description} onChange={handleFormChange} />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      {/* Trip Members */}
      <div className="mt-5">
        <h5>Trip Members</h5>
        <ul className="list-group">
          {members.map((m) => (
            <li key={m.UserID} className="list-group-item d-flex justify-content-between">
              {m.Username}
              <span className="badge bg-secondary">{m.PermissionLevel}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
