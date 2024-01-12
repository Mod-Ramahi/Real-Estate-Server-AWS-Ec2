const MessageModel = require('../models/messages');
const Photos = require('../models/photos');
const RealEstate = require('../models/realEstate');
const AWS = require('aws-sdk')
require('dotenv').config();


// const {ObjectId} = require('mongodb')
// const mongoose = require('mongoose')

const AddData = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token || !req.user) {
            return res.status(401).json({ message: 'user authentication failed' })
        }
        const {
            category,
            type,
            location,
            area,
            price,
            floor,
            rooms,
            furnishing,
            titleAr,
            titleEn,
            detailsAr,
            detailsEn,
            rank
        } = req.body;

        const newRealEstate = new RealEstate({
            category,
            type,
            location,
            area,
            price,
            floor,
            rooms,
            furnishing,
            titleAr,
            titleEn,
            detailsAr,
            detailsEn,
            rank
        });

        await newRealEstate.save();
        res.status(201).json({ message: 'new reaEstate successfully added', realEstate: newRealEstate })
    } catch (error) {
        res.status(500).json({ message: 'error adding new realEstate', error: error.message })
    }
}

const GetData = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token || !req.user) {
            return res.status(401).json({ message: 'user authintication faild' })
        }

        const { pageSize, currentPage, order, sortBy, textSearch, section } = req.query;
        const sort = sortBy;
        const sortOrder = order;
        const limit = pageSize;
        const skip = currentPage > 1 ? (currentPage - 1) * limit : 0;

        let query = RealEstate.find().sort({ [sort]: sortOrder }).skip(skip)

        if (section && section !== 'All') {
            query = query.where('category', section)
        }
        if (textSearch && textSearch.trim() !== '') {
            console.log(textSearch)
            // const objectId = new ObjectId(textSearch)
            const textPattern = new RegExp(textSearch, 'i')
            console.log('txtPattern: ', textPattern)
            query = query.or([
                { 'titleAr': { $regex: textPattern } },
                { 'titleEn': { $regex: textPattern } }

                // $where is not supported/allowed for this mongoose atlas tier
                // ,
                // {
                //     $where: function() {
                //         return this._id.toString().slice(-4).includes(textSearch)
                //     }
                // }
            ])

        }
        const DataResult = await query.limit(limit)
        res.json(DataResult)
    } catch (error) {
        res.status(500).json({ message: 'error getting data', error: error.message })
    }
}

const UiGetData = async (req, res) => {
    try {
        const { category, location, type, area, price, rooms, floor, furnishing, currentPage } = req.body;
        console.log(category, location, type)
        const limit = 8;
        const skip = currentPage > 1 ? (currentPage - 1) * limit : 0

        let query = RealEstate.find().sort({ rank: 1, createdAt: -1 }).skip(skip)

        if (category) {
            query = query.where('category').equals(category)
        }
        if (location && location !== 'All') {
            if (location === 'عبدون') {
                query = query.where('location').equals('abdoun')
            } else
                if (location === 'العبدلي') {
                    query = query.where('location').equals('alabdali')
                } else
                    if (location === 'الدوار السابع') {
                        query = query.where('location').equals('7thcircle')
                    } else
                        if (location === 'غير ذلك') {
                            query = query.where('location').equals('others')
                        } else {
                            const editedLocation = location.toLowerCase().replace(/\s/g, '')
                            query = query.where('location').equals(editedLocation)
                        }
        }
        if (type) {
            if (type === 'شقق') {
            } else if (type === 'فلل') {
                query = query.where('type').equals('apartment')
            } else if (type === 'ستوديوهات') {
                query = query.where('type').equals('villa')
            } else if (type === 'عمارات') {
                query = query.where('type').equals('building')
            } else if (type === 'مزارع') {
                query = query.where('type').equals('farm')
            } else if (type === 'اراضي') {
                query = query.where('type').equals('land')
            } else {
                const editedType = type.toLowerCase().replace(/s$/, '')
                query = query.where('type').equals(editedType)
            }
        }
        if (area) {
            if (area.includes('-')) {
                const [minValue, maxValue] = area.split('-').map(Number)
                query = query.where('area').gte(minValue).lte(maxValue)
            } else {
                const minValue = Number(area)
                query = query.where('area').gte(minValue)
            }
        }
        if (price) {
            if (price.includes('-')) {
                const [minValue, maxValue] = price.split('-').map(Number)
                query = query.where('price').gte(minValue).lte(maxValue)
            } else {
                const minValue = Number(area)
                query = query.where('price').gte(minValue)
            }
        }
        if (rooms) {
            if (rooms === 6) {
                query = query.where('rooms').gte(rooms)
            } else {
                query = query.where('rooms', rooms)
            }
        }
        if (floor) {
            if (floor === 6) {
                const roof = 'roof'
                query = query.where('floor', roof)
            } else {
                query = query.where('floor', floor)
            }
        }
        if (furnishing) {
            query = query.where('furnishing', furnishing)
        }

        const DataForUi = await query.limit(limit)
        if (!DataForUi) {
            return res.status(404).json({ message: 'no data found match the sort filter' })
        }
        res.status(200).json(DataForUi)

    } catch (error) {
        res.status(500).json({ message: 'error getting data for ui', error: error.message })
    }
}

const GetSingleData = async (req, res) => {
    try {
        // const token = req.headers.authorization;
        // if(!token || !req.user) {
        //     return res.status(401).json({message:'user authintication faild'})
        // }
        const id = req.params.id;
        const singleData = await RealEstate.findById(id)
        if (!singleData) {
            return res.json({ message: 'not found', status: 404 })
        }
        res.status(200).json({ message: 'success found', singleData })
    } catch (error) {
        res.status(501).json({ message: 'error getting single data', error: error.message })
    }
}

const SaveImgUrl = async (req, res) => {
    try {
        const { uploadedLink } = req.body;
        const id = req.params.id;
        console.log('image link: ', uploadedLink)
        const realEstate = await RealEstate.findById(id)
        if (!realEstate) {
            return res.status(404).json({ message: 'no realEstate found' })
        }

        if (uploadedLink) {
            realEstate.photoLinks.push(uploadedLink)
        }

        await realEstate.save()
        res.status(200).json({ message: 'success image ilink saved to related', realEstate, uploadedLink })
    } catch (error) {
        res.status(500).json({ message: 'error cant save image url in the realEstate', error: error.message })
    }
}

const UpdateRealEstateInfo = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token || !req.user) {
            return res.status(401).json({ message: 'user authentication failed' })
        }
        const id = req.params.id;
        const { category, type, location, area, price, furnishing, floor, rooms, titleEn, titleAr, detailsEn, detailsAr, rank } = req.body;

        const updatedEstate = await RealEstate.findById(id)

        updatedEstate.category = category
        updatedEstate.type = type
        updatedEstate.location = location
        updatedEstate.area = area
        updatedEstate.price = price
        updatedEstate.furnishing = furnishing
        updatedEstate.floor = floor
        updatedEstate.rooms = rooms
        updatedEstate.titleEn = titleEn
        updatedEstate.titleAr = titleAr
        updatedEstate.detailsEn = detailsEn
        updatedEstate.detailsAr = detailsAr
        updatedEstate.rank = rank

        await updatedEstate.save()

        res.status(200).json({ message: 'success update real estate info: ', updatedEstate })
    } catch (error) {
        res.status(500).json({ message: ' error ypdation real estate info', error: error.message })
    }
}

const DeleteCard = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token || !req.user) {
            return res.status(401).json({ message: 'user authorization failed' })
        }

        const id = req.params.id;
        // const photosModel = await Photos.deleteMany({ relatedTo: id })
        // const deleteRealEstate = await RealEstate.findByIdAndDelete(id)
        const PhotosToDelete = await Photos.find({ relatedTo: id })

        for (const photo of PhotosToDelete) {
            const s3 = new AWS.S3({
                accessKeyId: process.env.Aws_Key,
                secretAccessKey: process.env.Aws_Secret_Key
            })
            const params = {
                Bucket: 'test-bucket-ramahi-estate',
                Key: photo.key
            }
            await s3.deleteObject(params).promise()
        }
        await Photos.deleteMany({ relatedTo: id })
        await RealEstate.findByIdAndDelete(id)

        res.status(200).json({ message: 'success deleted' })
    } catch (error) {
        res.status(500).json({ message: 'error deleting realestate and photos', error: error.message })
    }
}

const SendMsg = async (req, res) => {
    try {
        const { name, email, message } = req.body
        const newMessage = new MessageModel({
            name,
            email,
            message
        })

        await newMessage.save()
        res.json(newMessage)
    } catch (error) {
        res.status(500).json({ message: 'error sending message', error: error.message })
    }
}

const GetMessages = async (req, res) => {
    try {
        const { pageSize } = req.query
        const limit = pageSize

        let query = MessageModel.find().sort({ createdAt: -1 })
        if (pageSize === 3) {
            query = query.limit(limit)
        }
        const Msgs = await query
        res.json(Msgs)
    } catch (error) {
        res.status(500).json({ message: 'error getting messages', error: error.message })
    }
}
const TestMe = async (req, res) => {
    try {
        res.json({message:'hello'})
        console.log('interaction works')
    } catch (error) {
        res.status(500).json({ message: 'error getting messages', error: error.message })
    }

}
module.exports = { AddData, GetData, GetSingleData, SaveImgUrl, UpdateRealEstateInfo, DeleteCard, UiGetData, SendMsg, GetMessages, TestMe };