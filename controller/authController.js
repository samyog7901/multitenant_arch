const { users } = require('../model')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

exports.renderRegisterForm = (req,res)=>{
    res.render("register")
}

exports.registerUser = async(req,res)=>{
    const {username,email,password} = req.body
    await users.create({
     email,
     username,
     password :  bcrypt.hashSync(password,8)
    })
 
    res.status(200).json({
        message : "User created successfully"
    })
 
 }

 exports.renderLoginForm = (req,res)=>{
    res.render("login")
}

exports.loginUser = async (req,res)=>{
    // access email and password 
    const {email,password} = req.body
    if(!email || !password){
        return res.send("Please provide email and password")
    }
    // check if email exists or not
    const user = await users.findAll({
        where : {
            email : email
        }
    })
    if(user.length == 0 ){
        res.status(404).json({
            message : "No user exist with that email"
        })
    }else{
        // check password matches or not
        const isPasswordMatched = bcrypt.compareSync(password,user[0].password)
        if(isPasswordMatched){
            const token = jwt.sign({id:user[0].id},'thisissecret')
            res.status(200).json({
                message: "User logged in successfully!",
                token
            })
        }else{
            res.status(404).json({
                message : "Password did not matched"
            })
        }

    }
    
}