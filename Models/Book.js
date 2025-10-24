const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:[true,"Please add Book Title"]
    },
    googleBookId: { 
        type: String,
        required: true,
    },
    author:{
        type:String,
        required:[true,"Please add Book Author"]
    },
    coverImage:{
        type:String,
        required:false,
    },
    status:{
        type:String,
        enum:['Want to Read','Reading','Completed'],
        default:'Want to Read'
    },
    isFavourite:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    }
},{timestamps:true})

bookSchema.index({ user: 1, googleBookId: 1 }, { unique: true });


module.exports = mongoose.model("Book",bookSchema)
