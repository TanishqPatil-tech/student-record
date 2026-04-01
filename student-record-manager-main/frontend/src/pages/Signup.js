import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signup as signupAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const { data } = await signupAPI({ name: form.name, email: form.email, password: form.password });
      login(data.token, data.user);
      toast.success('Account created! Welcome!');
      navigate('/dashboard');
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>📚 StudentRM</h1>
          <p>Student Record Manager</p>
        </div>
        <h2>Create account</h2>
        <p className="subtitle">Get started with StudentRM today</p>

        {errors.server && <div className="alert alert-error">{errors.server}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text" name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" name="password" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password" name="confirm" placeholder="Repeat password"
              value={form.confirm} onChange={handleChange}
              className={errors.confirm ? 'error' : ''}
            />
            {errors.confirm && <p className="form-error">{errors.confirm}</p>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
