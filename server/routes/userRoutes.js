import { Router } from 'express';
import { asyncHandler } from '../utilities/asyncHandler.js'; 

// Controller Imports
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';

// // Validation Import
// import { userInputValidation, userUpdateValidation } from '../../validation/inputValidation.js'

// Authentication
import { protectRoute } from '../auth/auth.js'

// Initialize Router
const router = Router();

// --- ROUTES --- //

// /api/users/create - POST
router.post('/create', asyncHandler(createUser));

// /api/users/all - GET
router.get('/all', protectRoute, asyncHandler(getAllUsers));

// /api/users/:id - GET
router.get('/:id', protectRoute, asyncHandler(getUserById));

// /api/users/:id - PATCH
router.patch('/:id', protectRoute, asyncHandler(updateUser));

// /api/users/:id - DELETE
router.delete('/:id', protectRoute, asyncHandler(deleteUser));

// --- END ROUTES --- //

// Export Router
export default router;