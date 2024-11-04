import bcrypt from 'bcryptjs';
import { run, getDb } from './db.js';
import initializeSchema from './schema.js';

async function seed() {
  try {
    // Ensure database is initialized
    await getDb();
    
    // Initialize schema first
    await initializeSchema();
    
    // Clear existing data in reverse order of dependencies
    await run('DELETE FROM teacher_students');
    await run('DELETE FROM parent_students');
    await run('DELETE FROM progress');
    await run('DELETE FROM lessons');
    await run('DELETE FROM modules');
    await run('DELETE FROM courses');
    await run('DELETE FROM users');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create test accounts
    const accounts = [
      { name: 'Admin User', email: 'admin@qlearn.com', role: 'admin' },
      { name: 'John Smith', email: 'john@test.com', role: 'student' },
      { name: 'Emma Wilson', email: 'emma@test.com', role: 'student' },
      { name: 'Michael Brown', email: 'michael@test.com', role: 'student' },
      { name: 'Test Parent', email: 'parent@test.com', role: 'parent' },
      { name: 'Test Instructor', email: 'instructor@test.com', role: 'instructor' }
    ];

    const userIds = {};

    for (const account of accounts) {
      const result = await run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [account.name, account.email, hashedPassword, account.role]
      );
      userIds[account.email] = result.lastID;
    }

    // Link parent to students
    const studentEmails = ['john@test.com', 'emma@test.com', 'michael@test.com'];
    for (const studentEmail of studentEmails) {
      await run(
        'INSERT INTO parent_students (parent_id, student_id) VALUES (?, ?)',
        [userIds['parent@test.com'], userIds[studentEmail]]
      );
    }

    // Create sample courses
    const courses = [
      { title: 'Mathematics 101', description: 'Introduction to Mathematics' },
      { title: 'Physics Fundamentals', description: 'Basic concepts of Physics' },
      { title: 'Computer Science Basics', description: 'Introduction to Programming' }
    ];

    for (const course of courses) {
      const courseResult = await run(
        'INSERT INTO courses (instructor_id, title, description) VALUES (?, ?, ?)',
        [userIds['instructor@test.com'], course.title, course.description]
      );
      const courseId = courseResult.lastID;

      // Create modules and lessons
      const moduleResult = await run(
        'INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)',
        [courseId, 'Module 1', 0]
      );
      const moduleId = moduleResult.lastID;

      const lessonResult = await run(
        'INSERT INTO lessons (module_id, title, content, order_index) VALUES (?, ?, ?, ?)',
        [moduleId, 'Lesson 1', 'Lesson content here', 0]
      );
      const lessonId = lessonResult.lastID;

      // Create progress for each student
      for (const studentEmail of studentEmails) {
        await run(
          'INSERT INTO progress (student_id, lesson_id, completed, score, time_spent) VALUES (?, ?, ?, ?, ?)',
          [
            userIds[studentEmail],
            lessonId,
            true,
            Math.floor(Math.random() * 30) + 70,
            Math.floor(Math.random() * 60) + 30
          ]
        );
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed().catch(console.error);