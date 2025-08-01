import { pool } from './db.js';

export const getUserByCode = async (code) => {
    const result = await pool.query('SELECT * FROM users WHERE code = $1', [code]);
    return result.rows[0];
};

export const getChildByParentAndSide = async (parentId, side) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE parent_id = $1 AND placement_side = $2',
        [parentId, side]
    );
    return result.rows[0];
};

export const getChildren = async (userId) => {
    const res = await pool.query(
        'SELECT * FROM users WHERE parent_id = $1 ORDER BY placement_side',
        [userId]
    );
    return res.rows;
};

export const createUser = async (userData) => {
    const {
        name,
        email,
        password_hash,
        code,
        sponsor_id,
        parent_id,
        placement_side,
    } = userData;

    await pool.query(
        `INSERT INTO users (name, email, password_hash, code, sponsor_id, parent_id, placement_side)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, email, password_hash, code, sponsor_id, parent_id, placement_side]
    );
};
