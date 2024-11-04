import { run } from './db.js';

async function initializeSchema() {
  try {
    // Users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'student', 'instructor', 'parent')) NOT NULL,
        contact_number TEXT,
        whatsapp_number TEXT,
        technology TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Courses table
    await run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        instructor_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id)
      )
    `);

    // Modules table
    await run(`
      CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    // Lessons table
    await run(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        video_url TEXT,
        content TEXT,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (module_id) REFERENCES modules(id)
      )
    `);

    // Progress table
    await run(`
      CREATE TABLE IF NOT EXISTS progress (
        student_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        time_spent INTEGER DEFAULT 0,
        last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (student_id, lesson_id),
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (lesson_id) REFERENCES lessons(id)
      )
    `);

    // Parent-Student relationships
    await run(`
      CREATE TABLE IF NOT EXISTS parent_students (
        parent_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        PRIMARY KEY (parent_id, student_id),
        FOREIGN KEY (parent_id) REFERENCES users(id),
        FOREIGN KEY (student_id) REFERENCES users(id)
      )
    `);

    // Teacher-Student relationships
    await run(`
      CREATE TABLE IF NOT EXISTS teacher_students (
        teacher_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        technology TEXT NOT NULL,
        assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (teacher_id, student_id),
        FOREIGN KEY (teacher_id) REFERENCES users(id),
        FOREIGN KEY (student_id) REFERENCES users(id)
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing schema:', error);
    throw error;
  }
}

export default initializeSchema;