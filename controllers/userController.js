import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
    getUserByCode,
    getChildByParentAndSide,
    createUser,
    getChildren
} from '../models/userModel.js';

export const registerUser = async (req, res) => {
    const { name, email, password, sponsorCode, placement } = req.body;

    try {
        // 1. Validate sponsor
        const sponsor = await getUserByCode(sponsorCode);
        if (!sponsor) {
            return res.status(400).json({ error: 'Invalid sponsor code' });
        }

        // 2. Traverse tree to find available parent slot
        let parentId = sponsor.id;
        while (true) {
            const child = await getChildByParentAndSide(parentId, placement);
            if (!child) break;
            parentId = child.id;
        }

        // 3. Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // 4. Generate unique code (you can improve this for readable pattern like D101, D102 etc.)
        const code = uuidv4().split('-')[0].toUpperCase();

        // 5. Save to DB
        await createUser({
            name,
            email,
            password_hash,
            code,
            sponsor_id: sponsor.id,
            parent_id: parentId,
            placement_side: placement,
        });

        res.status(201).json({ message: '✅ User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};


const buildTree = async (user) => {
    const children = await getChildren(user.id);
  
    const tree = {
      id: user.id,
      name: user.name,
      code: user.code,
      sponsor_id: user.sponsor_id,
      parent_id: user.parent_id,
      placement_side: user.placement_side,
      children: [],
    };
  
    for (const child of children) {
      const subtree = await buildTree(child);
      tree.children.push(subtree);
    }
  
    return tree;
  };
  
export const getUserTree = async (req, res) => {
    try {
        const { code } = req.params;
        const rootUser = await getUserByCode(code);

        if (!rootUser) {
            return res.status(404).json({ message: 'Sponsor not found' });
        }

        const tree = await buildTree(rootUser);
        res.json(tree);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};