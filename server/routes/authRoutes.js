import { Router } from 'express'

// Controller Imports
import { loginUser } from '../controllers/authController.js' 

const router = Router()

// Routes

// POST - /api/auth/login - Public
router.post('/login', loginUser)

export default router