import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getStudents, deleteStudent } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getStudents({ search });
      setStudents(data.students);
    } catch {
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success(`${name} removed successfully.`);
    } catch {
      toast.error('Failed to delete student.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>{students.length} record{students.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/students/add" className="btn btn-primary" style={{ width: 'auto' }}>
          + Add Student
        </Link>
      </div>

      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>
            Clear
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{search ? '🔍' : '📋'}</div>
            <h3>{search ? 'No results found' : 'No students yet'}</h3>
            <p>{search ? `No students match "${search}"` : 'Add your first student to get started.'}</p>
            {!search && (
              <Link to="/students/add" className="btn btn-primary" style={{ width: 'auto', marginTop: '1rem' }}>
                + Add Student
              </Link>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Course</th>
                  <th>Email</th>
                  <th>Enrolled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{i + 1}</td>
                    <td className="student-name">{s.name}</td>
                    <td>{s.age}</td>
                    <td><span className="badge badge-primary">{s.course}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.email || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(s.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <div className="actions">
                        <Link
                          to={`/students/edit/${s._id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(s._id, s.name)}
                          disabled={deleting === s._id}
                        >
                          {deleting === s._id ? '...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
