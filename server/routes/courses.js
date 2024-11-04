import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import client from '../db.js';
import { courseSchema } from '../validation/schemas.js';

const router = express.Router();

// Get all courses (with role-based filtering)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, id } = req.user;
    let courses;

    if (role === 'instructor') {
      const result = await client.execute({
        sql: 'SELECT * FROM courses WHERE instructor_id = ?',
        args: [id]
      });
      courses = result.rows;
    } else {
      const result = await client.execute({
        sql: `
          SELECT c.* FROM courses c
          INNER JOIN enrollments e ON c.id = e.course_id
          WHERE e.student_id = ?
        `,
        args: [id]
      });
      courses = result.rows;
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create new course (instructors only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ error: 'Only instructors can create courses' });
    }

    const { title, description, modules } = courseSchema.parse(req.body);

    const result = await client.execute({
      sql: 'INSERT INTO courses (instructor_id, title, description) VALUES (?, ?, ?) RETURNING id',
      args: [req.user.id, title, description]
    });

    const courseId = result.rows[0].id;

    if (modules) {
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        const moduleResult = await client.execute({
          sql: 'INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?) RETURNING id',
          args: [courseId, module.title, i]
        });

        const moduleId = moduleResult.rows[0].id;

        for (let j = 0; j < module.lessons.length; j++) {
          const lesson = module.lessons[j];
          await client.execute({
            sql: 'INSERT INTO lessons (module_id, title, video_url, content, order_index) VALUES (?, ?, ?, ?, ?)',
            args: [moduleId, lesson.title, lesson.videoUrl, lesson.content, j]
          });
        }
      }
    }

    res.status(201).json({ id: courseId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

export default router;