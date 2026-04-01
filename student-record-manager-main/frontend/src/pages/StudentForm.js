import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createStudent, updateStudent, getStudent } from '../services/api';

const COURSES = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Data Science',
  'Artificial Intelligence',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Commerce',
  'Arts & Humanities',
  'Other',
];

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', age: '', course: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getStudent(id)
        .then(({ data }) => {
          const s = data.student;
          setForm({
            name: s.name,
            age: s.age,
            course: s.course,
            email: s.email || '',
          });
        })
        .catch(() => {
          toast.error('Student not found.');
          navigate('/students');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.age) errs.age = 'Age is required.';
    else if (isNaN(form.age) || form.age < 5 || form.age > 100) errs.age = 'Age must be between 5 and 100.';
    if (!form.course) errs.course = 'Course is required.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
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
      const payload = { ...form, age: Number(form.age) };
      if (isEdit) {
        await updateStudent(id, payload);
        toast.success('Student updated successfully!');
      } else {
        await createStudent(payload);
        toast.success('Student added successfully!');
      }
      navigate('/students');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      toast.error(msg);
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{isEdit ? '✏️ Edit Student' : '➕ Add Student'}</h1>
          <p>{isEdit ? 'Update the student details below' : 'Fill in the details to add a new student'}</p>
        </div>
        <Link to="/students" className="btn btn-secondary" style={{ width: 'auto' }}>
          ← Back to Students
        </Link>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {errors.server && <div className="alert alert-error">{errors.server}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              name="age"
              placeholder="e.g. 20"
              value={form.age}
              onChange={handleChange}
              min="5"
              max="100"
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <p className="form-error">{errors.age}</p>}
          </div>

          <div className="form-group">
            <label>Course *</label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className={errors.course ? 'error' : ''}
            >
              <option value="">Select a course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.course && <p className="form-error">{errors.course}</p>}
          </div>

          <div className="form-group">
            <label>Email (optional)</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. priya@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? '✅ Update Student' : '✅ Add Student')}
            </button>
            <Link to="/students" className="btn btn-secondary" style={{ width: 'auto' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
