const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name:{ type: String, required: true},
    password:{type: String, required: true}
},{ timestamps: true })

const Admin = new mongoose.model('admin', adminSchema)

module.exports = Admin;