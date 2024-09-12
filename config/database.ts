import mongoose from "mongoose"
 const connectDatabase=async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Kết nối database thành công");
  }
  catch(e){
    console.log('Kết nối database thất bại')
  }
}

export default connectDatabase