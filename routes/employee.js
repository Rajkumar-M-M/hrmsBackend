import express from 'express'
import authMiddleware from '../middlewares/authmiddleware.js'
import { addEmployee, upload, getEmployees, getEmployee, updateEmployee } from '../controllers/empoyeeController.js'


const router = express.Router()

router.get('/', authMiddleware, getEmployees)
router.post('/add', authMiddleware, upload.single("image"), addEmployee)
router.get('/:id', authMiddleware, getEmployee)
router.put('/:id', authMiddleware, updateEmployee)
// router.delete('/:id', authMiddleware, deleteDepartment)

export default router