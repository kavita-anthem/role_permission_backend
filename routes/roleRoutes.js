import express from 'express';
import {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole,
  getRoleById,
} from '../controllers/roleController.js';

const router = express.Router();

// GET /api/roles — fetch all roles with permissions
router.get('/', getAllRoles);

// POST /api/roles — create a new role
router.post('/', createRole);

// PUT /api/roles/:id — update a role
router.put('/:id', updateRole);

// DELETE /api/roles/:id — delete a role
router.delete('/:id', deleteRole);

// GET /api/roles/:id — fetch a role by ID
router.get('/:id', getRoleById);

export default router;
