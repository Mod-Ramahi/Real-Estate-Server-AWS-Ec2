const mongoose = require('mongoose')

const realEstateSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    price: Number,
    area: Number,
    floor: Number,
    rooms: Number,
    furnishing: String,
    titleEn:{
        type:String,
        required:true
    },
    titleAr:{
        type:String,
        required:true
    },
    detailsEn:{
        type:String,
        required:true
    },
    detailsAr:{
        type:String,
        required:true
    },
    photoLinks:[String],
    rank:{
        type: Number,
        default:1
    }
},{ timestamps: true })

const RealEstate = mongoose.model('RealEstate', realEstateSchema);

module.exports = RealEstate;