import addLiveVideoController from '@/controllers/admin-controllers/live-class-controller/addLiveVideoController'
import getLiveVideosController from '@/controllers/admin-controllers/live-class-controller/getLiveVideoController'
import getAllLiveClassUserController from '@/controllers/user-controllers/live-class-controller/getAllLiveClassController'
import getLiveClassByIdController from '@/controllers/user-controllers/live-class-controller/getLiveClassByIdController'
import { authenticateAdmin } from '@/middleware/authenticateAdmin'
import { authenticateUser } from '@/middleware/authenticateUser'
import { Router } from 'express'


const router = Router()


router.post('/add', authenticateAdmin, addLiveVideoController)
router.get('admin/list', authenticateAdmin, getLiveVideosController)

// user controller
router.get('/tuition/list', authenticateUser, getAllLiveClassUserController)
router.get('/tuition/:videoId', authenticateUser, getLiveClassByIdController)



export default router