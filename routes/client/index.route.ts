import { taskRoute } from './task.route'
import { userRoute } from './user.route'
import { requireAuth } from '../../middlewares/client/auth.middlewares';

export const routeApi = (app) => {
  app.use('/tasks',
    requireAuth,
    taskRoute)
  app.use('/user', userRoute)
}