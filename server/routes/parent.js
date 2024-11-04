import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import client from '../db.js';

const router = express.Router();

// Get parent's children
router.get('/children', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await client.execute({
      sql: `
        SELECT u.* FROM users u
        INNER JOIN parent_students ps ON u.id = ps.student_id
        WHERE ps.parent_id = ?
      `,
      args: [req.user.id]
    });

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

// Get child's grades and progress
router.get('/grades/:childId', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          c.title as name,
          c.id,
          COALESCE(AVG(p.score), 0) as grade,
          COUNT(CASE WHEN p.completed = 1 THEN 1 END) * 100.0 / COUNT(*) as progress,
          u.name as teacherName,
          u.id as teacherId
        FROM courses c
        INNER JOIN enrollments e ON c.id = e.course_id
        INNER JOIN users u ON c.instructor_id = u.id
        LEFT JOIN modules m ON c.id = m.course_id
        LEFT JOIN lessons l ON m.id = l.module_id
        LEFT JOIN progress p ON l.id = p.lesson_id AND p.student_id = ?
        WHERE e.student_id = ?
        GROUP BY c.id
      `,
      args: [req.params.childId, req.params.childId]
    });

    const averageGrade = result.rows.reduce((acc, course) => acc + course.grade, 0) / result.rows.length;

    res.json({
      courses: result.rows,
      averageGrade: Math.round(averageGrade)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Get child's attendance
router.get('/attendance/:childId', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT * FROM attendance
        WHERE student_id = ?
        ORDER BY date DESC
        LIMIT 30
      `,
      args: [req.params.childId]
    });

    const attendanceRate = result.rows.reduce((acc, record) => acc + (record.present ? 1 : 0), 0) * 100 / result.rows.length;

    const absences = result.rows
      .filter(record => !record.present)
      .map(record => ({
        date: record.date,
        reason: record.reason
      }));

    res.json({
      recent: result.rows,
      attendanceRate: Math.round(attendanceRate),
      absences
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get child's progress
router.get('/progress/:childId', authenticateToken, async (req, res) => {
  try {
    const progressResult = await client.execute({
      sql: `
        SELECT 
          c.id as courseId,
          c.title as courseTitle,
          COUNT(DISTINCT CASE WHEN p.completed = 1 THEN l.id END) as completedLessons,
          COUNT(DISTINCT l.id) as totalLessons
        FROM courses c
        INNER JOIN enrollments e ON c.id = e.course_id
        INNER JOIN modules m ON c.id = m.course_id
        INNER JOIN lessons l ON m.id = l.module_id
        LEFT JOIN progress p ON l.id = p.lesson_id AND p.student_id = ?
        WHERE e.student_id = ?
        GROUP BY c.id
      `,
      args: [req.params.childId, req.params.childId]
    });

    const assignmentsResult = await client.execute({
      sql: `
        SELECT 
          e.id,
          e.title,
          e.description,
          e.date as dueDate,
          c.title as course
        FROM events e
        INNER JOIN course_events ce ON e.id = ce.event_id
        INNER JOIN courses c ON ce.course_id = c.id
        INNER JOIN enrollments en ON c.id = en.course_id
        WHERE en.student_id = ? AND e.date >= DATE('now')
        ORDER BY e.date ASC
        LIMIT 5
      `,
      args: [req.params.childId]
    });

    const achievementsResult = await client.execute({
      sql: `
        SELECT DISTINCT
          'Course Completion' as title,
          c.title || ' completed!' as description
        FROM progress p
        INNER JOIN lessons l ON p.lesson_id = l.id
        INNER JOIN modules m ON l.module_id = m.id
        INNER JOIN courses c ON m.course_id = c.id
        WHERE p.student_id = ? AND p.completed = 1
        LIMIT 5
      `,
      args: [req.params.childId]
    });

    const completedCourses = progressResult.rows.filter(
      course => course.completedLessons === course.totalLessons
    ).length;

    res.json({
      courses: progressResult.rows,
      completedCourses,
      totalCourses: progressResult.rows.length,
      assignments: assignmentsResult.rows,
      achievements: achievementsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get child's upcoming events
router.get('/events/:childId', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          e.id,
          e.title,
          e.description,
          e.date,
          c.title as courseName
        FROM events e
        INNER JOIN course_events ce ON e.id = ce.event_id
        INNER JOIN courses c ON ce.course_id = c.id
        INNER JOIN enrollments en ON c.id = en.course_id
        WHERE en.student_id = ? AND e.date >= DATE('now')
        ORDER BY e.date ASC
        LIMIT 10
      `,
      args: [req.params.childId]
    });

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Send message to teacher
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { teacherId, studentId, message } = req.body;

    await client.execute({
      sql: `
        INSERT INTO messages (sender_id, recipient_id, message, sent_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [req.user.id, teacherId, message]
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Report absence
router.post('/report-absence/:childId', authenticateToken, async (req, res) => {
  try {
    const { date, reason } = req.body;

    await client.execute({
      sql: `
        INSERT INTO attendance (student_id, date, present, reason)
        VALUES (?, ?, 0, ?)
        ON CONFLICT(student_id, date) DO UPDATE SET
        present = 0,
        reason = ?
      `,
      args: [req.params.childId, date, reason, reason]
    });

    res.json({ message: 'Absence reported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to report absence' });
  }
});

export default router;