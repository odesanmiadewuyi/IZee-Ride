import { Router, Request as ExpressRequest, Response } from 'express';
import { getAllUsers, getUserById, getCurrentUser } from '../controllers/users.controller';

interface RequestWithUser extends ExpressRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// Get current authenticated user
router.get('/me', getCurrentUser);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

export default router;
