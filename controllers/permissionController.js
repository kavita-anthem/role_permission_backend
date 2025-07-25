import { pool } from '../models/db.js';

export const getAllPermissions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM permissions ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching permissions:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
