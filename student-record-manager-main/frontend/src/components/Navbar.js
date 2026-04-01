import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <a href="/dashboard" className="navbar-brand">📚 StudentRM</a>
      <ul className="navbar-nav">
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/students">Students</NavLink></li>
        <li><NavLink to="/students/add">Add Student</NavLink></li>
      </ul>
      <div className="navbar-user">
        <span className="user-badge">👤 {user?.name}</span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
