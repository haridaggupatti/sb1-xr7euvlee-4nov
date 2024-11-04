import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { run, get, all, getDb } from './db.js';
import initializeSchema from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize database and schema when server starts
async function initializeServer() {
  try {
    await getDb();
    await initializeSchema();
    console.log('Database and schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Configure CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '..', 'dist')));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// API Routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role });
    
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ error: 'Invalid role' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign({ id: result.lastID, role }, JWT_SECRET);
    res.status(201).json({ token, role });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Protected API Routes
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await all('SELECT id, name, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await all('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize server and start listening
const PORT = process.env.PORT || 5000;

initializeServer().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);