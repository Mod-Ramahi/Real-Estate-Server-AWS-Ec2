const {Register, SignIn, GetAllAdmins, DeleteAdmin} = require('../controller/adminController');
const authMiddleware = require('../middleware')

const AdminRoute = require('express').Router();

AdminRoute.post('/createadmin', authMiddleware, Register)
AdminRoute.post('/signin', SignIn)
AdminRoute.get('/getalladmins', GetAllAdmins)
AdminRoute.delete('/deleteadmin/:id', authMiddleware, DeleteAdmin)

module.exports = AdminRoute