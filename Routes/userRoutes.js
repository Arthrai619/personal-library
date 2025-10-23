const {registerUser,loginUser} = require("../Controllers/userController")

const route = require("express").Router()

route.post("/register",registerUser)

route.post("/login",loginUser)


module.exports = route
