const { registerUser, loginUser } = require("../controller/authController")


const router = require("express").Router()


router.route("/register").post(registerUser) //API'S
router.route("/login").post(loginUser)

module.exports = router  //exporting the router to use in other files.