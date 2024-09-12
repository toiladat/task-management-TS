import { NextFunction, Request,Response } from "express";
import User from "../../models/user.models";

export const requireAuth=async(req:Request,res:Response,next:NextFunction)=>{
  const authorization:string=req.headers.authorization;
  if(!authorization){
    res.json({
      code:400,
      message:"Vui lòng gửi kèm theo token"
    })
    return
  }
  const token:string=authorization.split(" ")[1]
  if(!token){
    res.json({
      code:400,
      message:"Vui lòng gửi kèm theo token"
    })
    return
  }
  const user=await User.findOne({
    token:token,
    deleted:false
  })
  if(!user){
    res.json({
      code:400,
      message:"Tài khoản chưa tồn tại"
    })
    return
  }
  req["tokenVerify"]=token
  req['user']=user
  next()
}