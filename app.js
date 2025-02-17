const express = require('express')
const app = express()

const authRoute = require('./routes/authRoute')
const organizationRoute = require('./routes/organizationRoute')

require("./model/index")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("",authRoute)
app.use("",organizationRoute)

app.listen(4000,()=>{
    console.log('server is running on port 4000')
})