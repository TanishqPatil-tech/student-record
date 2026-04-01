import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents()
      .then((res) => setStudents(res.data.students))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const courses = [...new Set(students.map((s) => s.course))];
  const avgAge = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.age, 0) / students.length)
    : 0;
  const recent = students.slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>👋 Welcome, {user?.name}</h1>
          <p>Here's an overview of your student records</p>
        </div>
        <Link to="/students/add" className="btn btn-primary" style={{ width: 'auto' }}>
          + Add Student
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ede9fe' }}>🎓</div>
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Total Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>📘</div>
              <div className="stat-value">{courses.length}</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>📊</div>
              <div className="stat-value">{avgAge || '—'}</div>
              <div className="stat-label">Average Age</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>📅</div>
              <div className="stat-value">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
              <div className="stat-label">Today</div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Students</h2>
              <Link to="/students" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}>
                View all →
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-icon">📋</div>
                <h3>No students yet</h3>
                <p>Start by adding your first student record.</p>
                <Link to="/students/add" className="btn btn-primary" style={{ width: 'auto', marginTop: '1rem' }}>
                  + Add Student
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Course</th>
                      <th>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((s) => (
                      <tr key={s._id}>
                        <td className="student-name">{s.name}</td>
                        <td>{s.age}</td>
                        <td><span className="badge badge-primary">{s.course}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
