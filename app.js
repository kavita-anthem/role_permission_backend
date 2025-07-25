import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import roleRoutes from './routes/roleRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/roles', roleRoutes);

app.use('/api/permissions', permissionRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
