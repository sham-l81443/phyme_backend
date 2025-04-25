import addLiveVideoController from '@/api/controllers/admin-controllers/live-class-controller/addLiveVideoController'
import getLiveVideosController from '@/api/controllers/admin-controllers/live-class-controller/getLiveVideoController'
import getAllLiveClassUserController from '@/api/controllers/student-controllers/tution/get-tution-videos'
import getLiveClassByIdController from '@/api/controllers/student-controllers/tution/tution.videos.by.id'
import { authenticateAdmin } from '@/api/middleware/auth/authenticateAdmin'
import { authenticateStudent } from '@/api/middleware/auth/authenticateStudent'
import { Router } from 'express'


const router = Router()


// router.post('/add', authenticateAdmin, addLiveVideoController)
// router.get('admin/list', authenticateAdmin, getLiveVideosController)

// user controller
// router.get('/tuition/list', authenticateStudent, getAllLiveClassUserController)
// router.get('/tuition/:videoId', authenticateStudent, getLiveClassByIdController)



export default router