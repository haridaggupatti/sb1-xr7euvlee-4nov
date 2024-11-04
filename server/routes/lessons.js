import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import client from '../db.js';

const router = express.Router();

// Get lesson details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT l.*, t.id as test_id, t.title as test_title, t.passing_score
        FROM lessons l
        LEFT JOIN tests t ON l.id = t.lesson_id
        WHERE l.id = ?
      `,
      args: [req.params.id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Get lesson test
router.get('/:id/test', authenticateToken, async (req, res) => {
  try {
    const testResult = await client.execute({
      sql: 'SELECT * FROM tests WHERE lesson_id = ?',
      args: [req.params.id]
    });

    if (testResult.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const test = testResult.rows[0];

    const questionsResult = await client.execute({
      sql: 'SELECT * FROM questions WHERE test_id = ? ORDER BY id',
      args: [test.id]
    });

    res.json({
      ...test,
      questions: questionsResult.rows.map(q => ({
        ...q,
        options: JSON.parse(q.options),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// Submit test answers
router.post('/:id/test/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const testResult = await client.execute({
      sql: 'SELECT * FROM tests WHERE lesson_id = ?',
      args: [req.params.id]
    });

    if (testResult.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const test = testResult.rows[0];
    const questionsResult = await client.execute({
      sql: 'SELECT * FROM questions WHERE test_id = ?',
      args: [test.id]
    });

    const questions = questionsResult.rows;
    let correctAnswers = 0;

    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= test.passing_score;

    await client.execute({
      sql: `
        UPDATE progress
        SET score = ?, completed = ?
        WHERE student_id = ? AND lesson_id = ?
      `,
      args: [score, passed, req.user.id, req.params.id]
    });

    res.json({ score, passed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

export default router;