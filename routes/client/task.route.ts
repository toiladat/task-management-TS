import exp from "constants";
import express   from "express";
import * as controller from '../../controllers/task.controllers'
const route=express.Router()

route.get('/',controller.index)
route.get('/detail/:id',controller.detail)
route.patch('/change-status',controller.changeStatus)
route.post('/create',controller.create)
route.patch('/update',controller.update)
route.patch('/delete',controller.deleteTask)
export  const taskRoute=route