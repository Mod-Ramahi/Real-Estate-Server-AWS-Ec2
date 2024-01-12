const {AddData, GetData, GetSingleData, SaveImgUrl, UpdateRealEstateInfo, DeleteCard, UiGetData, SendMsg, GetMessages, TestMe} = require('../controller/dataController')
const authMiddleware = require('../middleware')

const DataRoute = require('express').Router()

DataRoute.post('/adddata', authMiddleware, AddData)
DataRoute.get('/getdata', authMiddleware, GetData)
DataRoute.get('/getsingle/:id', GetSingleData)
DataRoute.post('/photolink/:id', SaveImgUrl)
DataRoute.put('/updateinfo/:id', authMiddleware, UpdateRealEstateInfo)
DataRoute.delete('/deletecard/:id', authMiddleware, DeleteCard)
DataRoute.post('/uigetdata', UiGetData)
DataRoute.post('/messages', SendMsg)
DataRoute.get('/getmsgs', GetMessages)
DataRoute.get('/test', TestMe)

module.exports = DataRoute