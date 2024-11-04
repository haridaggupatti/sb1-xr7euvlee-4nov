import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '..', 'data');
const DB_FILE = join(DB_PATH, 'learning.db');

// Ensure data directory exists
async function initializeDatabase() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
    console.log('Database directory created or already exists');
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB_FILE, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
          return;
        }
        console.log('Connected to the SQLite database');
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(db);
        });
      });
    });
  } catch (error) {
    console.error('Error creating database directory:', error);
    throw error;
  }
}

let db;

// Initialize database connection
export const getDb = async () => {
  if (!db) {
    db = await initializeDatabase();
  }
  return db;
};

// Promisify database operations
export const run = async (sql, params = []) => {
  const database = await getDb();
  return new Promise((resolve, reject) => {
    database.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const get = async (sql, params = []) => {
  const database = await getDb();
  return new Promise((resolve, reject) => {
    database.get(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const all = async (sql, params = []) => {
  const database = await getDb();
  return new Promise((resolve, reject) => {
    database.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};