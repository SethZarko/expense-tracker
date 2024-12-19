import { Router } from "express"; 

import { asyncHandler } from '../utilities/asyncHandler.js'

import { protectRoute } from "../auth/auth.js";

import { createTransaction, getAllTransactions, deleteTransaction } from "../controllers/transactionController.js";

const router = Router()

// POST - Create
router.post('/create', protectRoute, asyncHandler(createTransaction))

// GET - Get All
router.get('/all/:year/:month?', protectRoute, asyncHandler(getAllTransactions))

// DELETE - Delete
router.delete('/:id', protectRoute, asyncHandler(deleteTransaction))

export default router;