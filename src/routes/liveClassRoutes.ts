import addLiveVideoController from '@/controllers/admin-controllers/live-class-controller/addLiveVideoController'
import getLiveVideosController from '@/controllers/admin-controllers/live-class-controller/getLiveVideoController'
import { authenticateAdmin } from '@/middleware/authenticateAdmin'
import { Router } from 'express'


const router = Router()


router.post('/add', authenticateAdmin, addLiveVideoController)
router.get('/list', authenticateAdmin, getLiveVideosController)


export default router