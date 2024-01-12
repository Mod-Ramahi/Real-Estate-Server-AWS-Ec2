const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    name:String,
    email:String,
    message:String,
},{timestamps: true})

const MessageModel = mongoose.model('MessageModel', MessageSchema)

module.exports = MessageModel;