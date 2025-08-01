import { pool } from '../models/db.js';
import bcrypt from 'bcrypt';

async function seedRootUser() {
  const name = 'Root User';
  const email = 'root@example.com';
  const plainPassword = 'root123'; // you can change this
  const password_hash = await bcrypt.hash(plainPassword, 10);
  const code = 'D100'; // default sponsor code

  try {
    await pool.query(
      `INSERT INTO users (name, email, password_hash, code, sponsor_id, parent_id, placement_side)
       VALUES ($1, $2, $3, $4, NULL, NULL, NULL)
       ON CONFLICT (email) DO NOTHING`,
      [name, email, password_hash, code]
    );

    console.log('✅ Root user seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding root user:', error.message);
  } finally {
    process.exit(0);
  }
}

seedRootUser();
