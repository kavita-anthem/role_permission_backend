import * as RoleModel from '../models/roleModel.js';

// Create a new role with permissions
export const createRole = async (req, res) => {
  const { name, permissionIds } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Role name is required' });
  }

  try {
    const role = await RoleModel.createRole(name, permissionIds || []);
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
};

// Get all roles with their permissions
export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// Update role name and permissions
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissionIds } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Role name is required' });
  }

  try {
    await RoleModel.updateRole(id, name, permissionIds || []);
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    await RoleModel.deleteRole(id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
};


// Get a role by ID with its permissions
export const getRoleById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const role = await RoleModel.getRoleById(id);
  
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
  
      res.json(role);
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).json({ error: 'Failed to fetch role' });
    }
  };
  