const AWS = require('aws-sdk')
const multer = require('multer')
const Photos = require('../models/photos')
const Admin = require('../models/admin')
const RealEstate = require('../models/realEstate')
require('dotenv').config();


const s3 = new AWS.S3({
    accessKeyId: process.env.Aws_Key,
    secretAccessKey: process.env.Aws_Secret_Key
})

const upload = multer({ dest: 'uploads/' })

const handleUpload = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token || !req.user) {
            return res.status(401).json({ message: 'user authentication failed' })
        }
        const fileContent = require('fs').readFileSync(req.file.path)
        console.log(fileContent)
        const params = {
            Bucket: 'test-bucket-ramahi-estate',
            Key: req.file.originalname,
            Body: fileContent,
            ContentType: req.file.mimetype
        }

        const uploadResult = await s3.upload(params).promise()
        const imageUrl = uploadResult.Location
        const imageKey = uploadResult.Key


        const id = req.params.id
        const newPhoto = new Photos({
            imgUrl: imageUrl,
            key: imageKey,
            relatedTo: id,
        })

        await newPhoto.save()

        return res.json({ uploadResult, imageUrl, imageKey, newPhoto })
    } catch (error) {
        res.status(500).json({ message: 'cant upload image', error: error.message })
    }

}

const handleDelete = async (req, res) => {
    try {
        console.log('handledelete reached')
        const token = req.headers.authorization;
        if (!token || !req.user) {
            return res.status(401).json({ message: 'user authentication failed' })
        }
        const { link } = req.body;
        const photo = await Photos.findOne({ imgUrl: link })
        if (!photo) {
            return res.status(404).json({ message: 'no photo found' })
        }

        const id = photo._id;
        const key = photo.key;
        const realEstateId = photo.relatedTo;

        const params = {
            Bucket: 'test-bucket-ramahi-estate',
            Key: key
        }

        const deletedPhoto = await s3.deleteObject(params).promise()

        const FindEstate = await RealEstate.findById(realEstateId)
        if(!FindEstate){
            return res.status(404).json({ message: 'no real-estate found' })
        }
        const updateEstate = FindEstate.photoLinks.filter(photoLink => photoLink !== link)
        FindEstate.photoLinks = updateEstate

        const deletedDataPhoto = await Photos.findByIdAndDelete(id)
        
        
        if (!deletedDataPhoto || !deletedPhoto) {
            return res.status(404).json({ message: 's3 bucket photo or / and  database photo not found or not deleted' })
        }

        await FindEstate.save()
        res.json({ message: 'success delete photo', deletedPhoto, deletedDataPhoto })

    } catch (error) {
        res.status(500).json({ message: 'error, cant delete photo', error: error.message })
    }

}



module.exports = { handleUpload, upload, handleDelete }

