import React, { useEffect, useState } from 'react';

export default function CurrencyRates() {
  const [rates, setRates] = useState([]);
  const [form, setForm] = useState({
    Date: '',
    BaseCurrency: '',
    TargetCurrency: '',
    Rate: '',
  });

  useEffect(() => {
    fetch('/api/currency-rates')
      .then(res => res.json())
      .then(setRates);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddRate = (e) => {
    e.preventDefault();

    fetch('/api/currency-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then((newRate) => {
        setRates([newRate, ...rates]); // Add new rate to top
        setForm({ Date: '', BaseCurrency: '', TargetCurrency: '', Rate: '' });
      });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Currency Exchange Rates</h2>

      {/* Add Form */}
      <form onSubmit={handleAddRate} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="date"
            name="Date"
            className="form-control"
            value={form.Date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            name="BaseCurrency"
            className="form-control"
            placeholder="From (e.g. USD)"
            value={form.BaseCurrency}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            name="TargetCurrency"
            className="form-control"
            placeholder="To (e.g. EUR)"
            value={form.TargetCurrency}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="Rate"
            className="form-control"
            step="0.0001"
            placeholder="Rate"
            value={form.Rate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">Add Rate</button>
        </div>
      </form>

      {/* Rate Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Base Currency</th>
            <th>Target Currency</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, idx) => (
            <tr key={idx}>
              <td>{rate.Date}</td>
              <td>{rate.BaseCurrency}</td>
              <td>{rate.TargetCurrency}</td>
              <td>{parseFloat(rate.Rate).toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
