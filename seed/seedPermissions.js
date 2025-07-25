import { pool } from "../models/db.js";


const permissions = [
  'view_users',
  'edit_users',
  'delete_users',
  'view_roles',
  'edit_roles',
  'delete_roles',
  'manage_settings',
  'view_orders',
  'edit_orders',
  'delete_orders',
];

async function seedPermissions() {
  for (const name of permissions) {
    await pool.query(
      'INSERT INTO permissions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
      [name]
    );
  }
  console.log('✅ Permissions seeded successfully');
  process.exit(0);
}

seedPermissions();
