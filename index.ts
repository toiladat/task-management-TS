import { log } from 'console';

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()

import connectDatabase from './config/database'
import Task from "./models/task.models";
connectDatabase()

const app: Express = express()
const port: string | number = process.env.PORT

app.get('/tasks', async (req: Request, res: Response) => {
  const tasks = await Task.find({})
  res.json(tasks)
})

app.get('/tasks/detail/:id', async (req: Request, res: Response) => {
  const id = req.params.id  
  const task = await Task.findOne({
    _id: id,
    deleted:false
  }
  )

  res.json(task)
})



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})