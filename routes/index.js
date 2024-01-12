const AdminRoute = require('./adminRoutes')
const express = require('express')
const DataRoute = require('./dataRoutes')
const PhotoRoute = require('./photoRoutes')

const router = express.Router()

router.use('/administration', AdminRoute)
router.use('/data', DataRoute)
router.use('/photo', PhotoRoute)

module.exports = router