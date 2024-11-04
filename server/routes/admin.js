import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import client from '../db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await client.execute(`
      SELECT id, name, email, role, created_at
      FROM users
      WHERE role != 'admin'
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new user
router.post('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.execute({
      sql: 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id',
      args: [name, email, hashedPassword, role]
    });

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { id } = req.params;

    await client.execute({
      sql: 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      args: [name, email, role, id]
    });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await client.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [req.params.id]
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all courses
router.get('/courses', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await client.execute(`
      SELECT c.*, u.name as instructor_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create new course
router.post('/courses', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, instructorId } = req.body;

    const result = await client.execute({
      sql: 'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?) RETURNING id',
      args: [title, description, instructorId]
    });

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
router.put('/courses/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, instructorId } = req.body;
    const { id } = req.params;

    await client.execute({
      sql: 'UPDATE courses SET title = ?, description = ?, instructor_id = ? WHERE id = ?',
      args: [title, description, instructorId, id]
    });

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course
router.delete('/courses/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await client.execute({
      sql: 'DELETE FROM courses WHERE id = ?',
      args: [req.params.id]
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Assign course to student
router.post('/enrollments', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    await client.execute({
      sql: 'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      args: [studentId, courseId]
    });

    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

// Link parent to student
router.post('/parent-student', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { parentId, studentId } = req.body;

    await client.execute({
      sql: 'INSERT INTO parent_students (parent_id, student_id) VALUES (?, ?)',
      args: [parentId, studentId]
    });

    res.status(201).json({ message: 'Parent-student link created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to link parent and student' });
  }
});

export default router;