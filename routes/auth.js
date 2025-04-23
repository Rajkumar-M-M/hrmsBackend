import express from 'express'
import { login, verify } from '../controllers/authController.js'
import authMiddleware from '../middlewares/authmiddleware.js'


const router = express.Router()

router.post('/login', login)
router.get('/verify', authMiddleware, verify )

export default router; 