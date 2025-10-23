const {getBook,createBook,updateBook,deleteBook} = require("../Controllers/bookController")

const route = require("express").Router()

const auth = require("../Middleware/auth")

route.get("/",auth,getBook)

route.post("/",auth,createBook)

route.put("/:id",auth,updateBook)

route.delete("/:id",auth,deleteBook)

module.exports = route