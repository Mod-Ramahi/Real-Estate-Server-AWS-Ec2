const Admin = require('../models/admin');
const registerSchema = require('../validation')
const bcrypt = require('bcrypt')
const jwtUtilis = require('../utility');

const Register = async (req, res) => {
    try{
        
        const token = req.headers.authorization
        if(!token || !req.user){
            return res.status(401).json({message:'user authentication failed'})
        }
        console.log('reached')
        const {name, password} = req.body;
        await registerSchema.validate({name, password})
        const existAdmin = await Admin.findOne({name});
        if (existAdmin) {
            return res.json({message:"admin name already exists", status: 409})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        // console.log('password:', password, 'hashed password:', hashedPassword)
        const newAdmin = new Admin({
            name,
            password: hashedPassword
        })
        await newAdmin.save()
        const user = await Admin.findOne({name})
        res.status(201).json({id:user._id, name:user.name})
    } catch (error){
        res.status(500).json({message:'error. cant create new admin', error: error.message})
    }
}

const SignIn = async (req,res) => {
    try{
        const {name, password} = req.body;
        await registerSchema.validate({name, password})
        const user = await Admin.findOne({name})
        if(!user){
            return res.status(401).json({message:'invalid user name or password', status: 401})
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch) {
            return res.status(401).json({message:'invalid user name or password', status: 401})
        }
        const expiresIn = '4h';
        const token = await jwtUtilis.generateToken({id:user._id, name:user.name}, {expiresIn})
        res.status(200).json({id:user._id, name: user.name, token})
    } catch(error){
        res.status(500).json({message:'error. cant sign in', error:error.message})
    }
}

const GetAllAdmins = async (req, res) => {
    try{
        const getAdmins = await Admin.find()
        if(!getAdmins){
            return res.status(404).json({message:'no admins founded'})
        }
        res.json(getAdmins)
    } catch(error){
        res.status(500).json({message:'error, cant get admins', error: error.message})
    }
}

const DeleteAdmin = async (req, res) => {
    try{
        const token = req.headers.authorization;
        if (!token || !req.user) {
            return res.status(401).json({message:'user authorization failed'})
        }

        const id = req.params.id;

        await Admin.findByIdAndDelete(id)

        res.json({message:'success deleted admin'})
    } catch (error) {
        res.status(500).json({message:'error, cant delete admin'})
    }
}

module.exports = {Register, SignIn, GetAllAdmins, DeleteAdmin}