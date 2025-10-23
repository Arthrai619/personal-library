const {searchGoogleBooks} = require("../Controllers/discoverController")
const route = require("express").Router()
route.get("/",searchGoogleBooks)
module.exports = route