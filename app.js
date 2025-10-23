const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./Routes/userRoutes")
const bookRoutes = require("./Routes/bookRoutes")
const discoverRoutes = require("./Routes/discoverRoutes")   
require("dotenv").config()
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/users",userRoutes)

app.use("/api/books",bookRoutes)

app.use("/api/discover",discoverRoutes)

app.get("/",(req,res)=>{
    res.send("API is running")
})

app.listen(process.env.PORT)

async function DB() {
    try {
        const conn = await mongoose.connect(process.env.DB)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`)
    }
}

DB()
