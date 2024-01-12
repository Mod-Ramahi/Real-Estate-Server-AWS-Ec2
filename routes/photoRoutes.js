const {handleUpload, upload, handleDelete, TestAuth} = require('../controller/photoController')
const authMiddleware = require('../middleware')

const PhotoRoute = require('express').Router()

PhotoRoute.delete('/deletephoto', authMiddleware, handleDelete)
PhotoRoute.post('/addphoto/:id', upload.single('image'), authMiddleware, handleUpload)
module.exports = PhotoRoute
