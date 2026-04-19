 import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket/socket.js"

app.use(cors(
  {
    origin:"https://realtimechatapp-plgd.onrender.com",credentials:true
  }
))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

app.get("/", (req, res) => {
  res.send("Server working ✅")
})

const port = process.env.PORT || 8000


connectDb().then(() => {
  server.listen(port, () => {
    console.log(`Server started on port ${port}`)
  })
}).catch((err) => {
  console.log("Failed to connect to DB", err)
})
