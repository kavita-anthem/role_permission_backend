import { pool } from '../models/db.js';

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      sponsor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      parent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      placement_side CHAR(1) CHECK (placement_side IN ('A', 'B')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log('✅ Users table created successfully');
  } catch (error) {
    console.error('❌ Error creating users table:', error.message);
  } finally {
    process.exit(0);
  }
};

createUsersTable();
