import addLiveVideoController from '@/api/controllers/admin-controllers/video/add.tution.video.controller'
import getLiveVideosController from '@/api/controllers/admin-controllers/video/get.tution.videos.ontroller'
import getLiveClassByIdController from '@/api/controllers/student-controllers/tution/tution.videos.by.id'
import { authenticateAdmin } from '@/core/middleware/auth/authenticateAdmin'
import { authenticateStudent } from '@/core/middleware/auth/authenticateStudent'
import { Router } from 'express'


const router = Router()


// router.post('/add', authenticateAdmin, addLiveVideoController)
// router.get('admin/list', authenticateAdmin, getLiveVideosController)

// user controller
// router.get('/tuition/list', authenticateStudent, getAllLiveClassUserController)
// router.get('/tuition/:videoId', authenticateStudent, getLiveClassByIdController)



export default router