const user = require('../models/user');

const bcrypt = require('bcryptjs');

const AddUser = async(req, res) => {
    return res.send('user is added in user.controller!!!');
}

const Register = async(req, res) => {

    const {email, name, password, phone} = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }

    if (existinguser) {
        return res.status(400).json({success: false, message: "Email already exist!! ", datat: null});
    } 

    const hashedpassword = await bcrypt.hash(password, 10);

    const NewUser = new user({
        email,
        name,
        phone,
        password: hashedpassword
    });

    try {
        await NewUser.save();
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while saving user", data: error});
    }

    return res.status(200).json({success: true, message: `user added successfly`, data: NewUser});
}

const Login = async(req, res) => {

    const {email, password} = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({success: false, message: "server error while fetching user", data: error});
    }

    if (!existinguser) {
        return res.status(400).json({success: false, message: "Email doesn't exist!! ", datat: null});
    }  

    let check = await bcrypt.compare(password, existinguser.password);

    if (!check) {
        return res.status(400).json({success: false, message: "Check your password ", datat: null});
    }  

    return res.status(200).json({success: true, message: `Welcome ${existinguser.name}`, data: existinguser});

}

exports.AddUser = AddUser
exports.Login = Login
exports.Register = Register