import express from 'express';
import * as controller from "../../controllers/user.controller"
import { requireAuth } from '../../middlewares/client/auth.middlewares';
const route = express.Router()

route.post('/register', controller.register)
route.post('/login', controller.login)
route.post('/password/forgot',controller.forgot)
route.post('/password/otp',controller.typeOtp)
route.post('/password/reset',controller.resetPassword)

route.get('/profile',
  requireAuth,
  controller.profile)
export const userRoute = route