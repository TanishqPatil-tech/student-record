const express = require('express');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/students — Get all students
router.get('/', async (req, res) => {
  try {
    const { search, course } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
      ];
    }
    if (course) {
      query.course = { $regex: course, $options: 'i' };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json({ count: students.length, students });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
});

// GET /api/students/:id — Get single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student.' });
  }
});

// POST /api/students — Create student
router.post('/', async (req, res) => {
  try {
    const { name, age, course, email } = req.body;

    if (!name || !age || !course) {
      return res.status(400).json({ message: 'Name, age, and course are required.' });
    }

    const student = await Student.create({
      name,
      age,
      course,
      email,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Student added successfully.', student });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Failed to create student.' });
  }
});

// PUT /api/students/:id — Update student
router.put('/:id', async (req, res) => {
  try {
    const { name, age, course, email } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, course, email },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({ message: 'Student updated successfully.', student });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Failed to update student.' });
  }
});

// DELETE /api/students/:id — Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student.' });
  }
});

module.exports = router;
