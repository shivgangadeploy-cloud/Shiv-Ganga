import express from "express"
import app from "./app.js"
import {config} from "./configs/env.js"
import {connectDB} from "./configs/db.js"

const PORT = config.PORT || 5000

const startServer =async () =>{
  await connectDB()
  
  app.listen(PORT,()=>{
    console.log(`server running on port http://localhost:${PORT}`)
  })
}

startServer()