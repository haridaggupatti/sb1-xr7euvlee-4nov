import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import client from '../db.js';

const router = express.Router();

// Get student progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT p.*, l.title as lesson_title, m.title as module_title, c.title as course_title
        FROM progress p
        INNER JOIN lessons l ON p.lesson_id = l.id
        INNER JOIN modules m ON l.module_id = m.id
        INNER JOIN courses c ON m.course_id = c.id
        WHERE p.student_id = ?
        ORDER BY p.last_accessed DESC
      `,
      args: [req.user.id]
    });

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update progress
router.post('/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { completed, score, timeSpent } = req.body;

    await client.execute({
      sql: `
        INSERT INTO progress (student_id, lesson_id, completed, score, time_spent)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(student_id, lesson_id) DO UPDATE SET
        completed = ?,
        score = COALESCE(?, score),
        time_spent = time_spent + ?,
        last_accessed = CURRENT_TIMESTAMP
      `,
      args: [req.user.id, lessonId, completed, score, timeSpent, completed, score, timeSpent]
    });

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;