const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please add Your Name"]
    },
    email:{
        type:String,
        required:[true,"Please add Your Email"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Please add Your Password"],
    }
},{timestamps:true})


module.exports = mongoose.model('User',userSchema)