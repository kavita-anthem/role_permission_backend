import { pool } from "./db.js";


// Create a new role
export const createRole = async (name, permissionIds = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO roles (name) VALUES ($1) RETURNING id',
      [name]
    );
    const roleId = result.rows[0].id;

    for (const pid of permissionIds) {
      await client.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
        [roleId, pid]
      );
    }

    await client.query('COMMIT');
    return { id: roleId, name };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Get all roles with their permissions
export const getAllRoles = async () => {
  const result = await pool.query(`
    SELECT r.id as role_id, r.name as role_name, p.id as permission_id, p.name as permission_name
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
  `);

  const roles = {};

  result.rows.forEach(row => {
    if (!roles[row.role_id]) {
      roles[row.role_id] = {
        id: row.role_id,
        name: row.role_name,
        permissions: [],
      };
    }
    if (row.permission_id) {
      roles[row.role_id].permissions.push({
        id: row.permission_id,
        name: row.permission_name,
      });
    }
  });

  return Object.values(roles);
};

// Update role name and permissions
export const updateRole = async (roleId, newName, permissionIds = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('UPDATE roles SET name = $1 WHERE id = $2', [newName, roleId]);
    await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);

    for (const pid of permissionIds) {
      await client.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
        [roleId, pid]
      );
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Delete a role
export const deleteRole = async (roleId) => {
  await pool.query('DELETE FROM roles WHERE id = $1', [roleId]);
};

// Get a single role with its permissions
export const getRoleById = async (id) => {
    const roleResult = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
  
    if (roleResult.rows.length === 0) return null;
  
    const role = roleResult.rows[0];
  
    const permissionsResult = await pool.query(
      `SELECT p.id, p.name FROM permissions p
       INNER JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = $1`, [id]
    );
  
    return {
      id: role.id,
      name: role.name,
      permissions: permissionsResult.rows,
    };
  };