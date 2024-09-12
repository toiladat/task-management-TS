
import express, { Express, Request, Response } from "express";
import cors from "cors"
import bodyParser from "body-parser";
import {routeApi} from "./routes/client/index.route"

import dotenv from "dotenv"
dotenv.config()


const app: Express = express()
const port: string | number = process.env.PORT

import connectDatabase from './config/database'
connectDatabase()

//CORS
//cach 1: Tat ca cac ten mien duoc phep truy cap
app.use(cors())

//cach 2: ap dung cho 1 ten mien cu the
// const corsOptions={
//   origin:'ten mien tai day',
//   optionsSuccessStatus:200
// }
// app.use(cors(corsOptions))

//END CORS
app.use(bodyParser.json())


routeApi(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})