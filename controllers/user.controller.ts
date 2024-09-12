import { sendEmail } from './../helper/sendEmail.helper';
import { Request,Response } from "express"
import User from "../models/user.models"
import {generateRandomNumber, generateRandomString} from "../helper/generate.helper"

import md5 from "md5"
import ForgotPassword from "../models/forgot-password.models"


//[POST]/user/register
export const register=async(req:Request,res:Response)=>{
  const existUser=await User.findOne({
    email:req.body.email
  })
  if(existUser){
    res.json({
      message:"Email đã tồn tại",
      code:400
    })
    return
  }
  const token =generateRandomString(32)
  const dataUser:{}={
    fullName:req.body.fullName,
    email:req.body.email,
    password:md5(req.body.password),
    token:token
  }
  const newUser=new User(dataUser)
  await newUser.save()

  res.json({
    code:200,
    message:"Đăng ký thành công",
    token:token
  })

}
//[POST]/user/login
export const login=async(req:Request,res:Response)=>{
  const email=req.body.email
  const password=req.body.password
  const existUser=await User.findOne({
    email:email
  })
  if(!existUser){
    res.json({
      code:400,
      message:"Email không tồn tại"
    })
    return
  }
  if(existUser.password!=md5(password)){
    res.json({
      code:400,
      message:"Password Không đúng "
    })
    return
  }
  res.json({
    code:200,
    message:"Đăng nhập thành công",
    token:existUser.token
  })
}
//[POST]/user/password/forgot
export const forgot=async(req:Request,res:Response)=>{
  const email=req.body['email']
  console.log(email);
  
  const existUser=await User.findOne({
    email:email
  })
  if(!existUser){
    res.json({
      code:400,
      message:"Email không tồn tại"
    })
    return
  }
  const otp:string =generateRandomNumber(6);

  //luu vao csdl
  const forgotData={
    email:email,
    otp:otp,
    expireAt:Date.now()+3*60*1000
  }
  const forgotPassword= new ForgotPassword(forgotData)
  await forgotPassword.save()
//send email
const subject="Mã OTP lấy lại mật khẩu"
const htmls=`<p>Mã OTP là <b style="color:red">${otp}</b>. Có hiệu lực trong 3 phút </p>`
sendEmail(email,subject,htmls)

res.json({
  code:200,
  message:"Đã gửi mã OTP"
})  
    
}
//[POST]/user/password/otp
export const typeOtp=async(req:Request,res:Response)=>{
  const {email,otp}=req.body
  
  const result = await ForgotPassword.findOne({
    email:email,
    otp:otp
  })
  
  if(!result){
    res.json({
      code:400,
      message:"Otp không hợp lệ"
    })
    return
  }
  const user=await User.findOne({
    email:email,
    deleted:false
  }).select('token')

  res.json({
    code:200,
    token:user.token
  })
}
//[POST]/user/password/reset
export const resetPassword=async(req:Request,res:Response)=>{
  //gui token qu body khong dua vao cookie
  const {token,password}=req.body
  const user = await User.findOne({
    token: token,
    deleted: false
  })
  if (!user) {
    res.json({
      code: 400,
      message: "Cập nhật mật khẩu thất bại"
    })
    return
  }
  await User.updateOne({
    token: token,
    deleted: false
  }, {
    password: md5(password)
  })
  res.json({
    code: 200,
    message: "Cập nhật mật khẩu thành công"
  })
}
//[POST]/user/profile
export const profile=async(req:Request,res:Response)=>{  
  const user=await User.findOne({
    token:req['tokenVerify'],
    deleted:false
  }).select('-password -token')
  res.json({
    code:200,
    user:user
  })
}