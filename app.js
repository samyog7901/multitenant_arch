const express = require('express')
const app = express()

const authRoute = require('./routes/authRoute')
const organizationRoute = require('./routes/organizationRoute')
const {Server, Socket} = require('socket.io')

const ejs = require('ejs')
app.set('view engine', 'ejs')

const cookieParser = require('cookie-parser')
require("./model/index")

app.use(cookieParser())//invoked
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use("",authRoute)
// app.use("",organizationRoute)

app.get("/",(req,res)=>{
    res.render("chat")
})

const server = app.listen(3000,()=>{
    console.log('server is running on port 3000')
})
const io = new Server(server)

io.on("connection",(socket)=>{
    console.log("new client connected")
    socket.on("message",(msg)=>{
        io.emit("broadCastMessage",msg)
    })
})