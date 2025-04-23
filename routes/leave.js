import express from 'express'
import authMiddleware from '../middlewares/authmiddleware.js'
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave,getLeaveBalanceDetails} from '../controllers/leaveController.js'



const router = express.Router()

router.post('/add', authMiddleware, addLeave)
router.get('/detail/:id', authMiddleware, getLeaveDetail)
router.get('/:id/:role', authMiddleware, getLeave)
router.get('/', authMiddleware,  getLeaves)
router.put('/:id', authMiddleware, updateLeave)
router.get('/balance-details', getLeaveBalanceDetails);



export default router