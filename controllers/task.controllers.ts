import { Request, Response } from "express"
import Task from "../models/task.models"
import exp from "constants"
//[GET] /tasks
export const index = async (req: Request, res: Response) => {
  const find = {
    deleted: false
  }

  //status
  if (req.query["status"]) {
    find["status"] = req.query["status"]
  }
  //end status



  // //sort
  const sort = {}
  //Chuyen thanh string thi moi dung sort[sortkey]=sortvalue duoc
  const sortKey = `${req.query["sortKey"]}`
  const sortValue = `${req.query["sortValue"]}`
  if (req.query["sortKey"] && req.query["sortValue"]) {
    sort[sortKey] = sortValue
  }
  // //end sort

  // //pagination
  const page: number = parseInt(`${req.query['page']}`) || 1
  const limitItems: number = parseInt(`${req.query['limitItems']}`) || 3
  const skip: number = (page - 1) * limitItems
  // //end pagination

  // //find
  if (req.query['keyword']) {
    const regex = new RegExp(`${req.query['keyword']}`, 'i')
    find['title'] = regex
  }
  // //end find


  const tasks = await Task
    .find(find)
    .limit(limitItems)
    .skip(skip)
    .sort(sort)
  res.json(tasks)
}

//[GET] /tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const task = await Task.findOne({
      _id: id,
      deleted: false
    }
    )
    res.json(task)
  }
  catch {
    res.json({
      message: "Task không hợp lệ"
    })
  }
}

//[PATCH] /tasks/change-status
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const statusType = ['initial', 'doing', 'finish', 'not finish']
    const status: string = statusType.includes(req.body['status']) ? req.body['status'] : 'inital'
    const ids: string[] = req.body['ids']

    await Task.updateMany({
      _id: {
        $in: ids
      }
    }, {
      status: status
    })

    res.json({
      code: 200,
      message: "Cập nhật thành công "
    })
  }
  catch {
    res.json({
      code: 400
    })
  }
}
//[POST] /tasks/create
export const create = async (req: Request, res: Response) => {
  try {
    req.body.createdBy=req['user']._id
    const task: {} = req.body
    const newTask = new Task(task)
    await newTask.save()

    res.json({
      id: newTask._id,
      message: "Thêm Task thành công"
    })

  }
  catch {
    res.json({
      message: "Thêm Task thất bại"
    })
  }
}
//[PATCH]/tasks/update
export const update = async (req: Request, res: Response) => {
  try {
    const id: string = req.body._id
    await Task.updateOne({
      _id: id
    }, req.body)
  }
  catch {
    res.json({
      message: "Cập nhật Task thất bại"
    })
  }
}
//[PATCH]/tasks/delete
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body
    for (const id of ids) {
      const checkTask = await Task.findOne({
        _id: id
      })
    }

    await Task.updateMany({
      _id: {
        $in: ids
      }
    }, {
      deleted: true
    })
  }
  catch {
    res.json({
      message: "Xóa Task Thất bại"
    })
  }
}