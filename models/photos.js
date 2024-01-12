const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    imgUrl: String,
    key: String,
    relatedTo:{type: mongoose.Schema.Types.ObjectId, ref:'RealEstate'}
},{ timestamps: true })

const Photos = mongoose.model('Photos', photoSchema)
module.exports = Photos