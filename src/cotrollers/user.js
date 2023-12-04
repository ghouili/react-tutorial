const user = require('../models/user');

const fs = require('fs');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "soltanihajer001@gmail.com",
        pass: "xrzqyjvrxrddtdhb"
    }
});


const GetAllUser = async (req, res) => {

    let existingusers;
    try {
        existingusers = await user.find();
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while fetching user", data: error });
    }

    return res.status(200).json({ success: true, message: `All Users`, data: existingusers });
}

const FindUserById = async (req, res) => {

    const { id } = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while fetching user", data: error });
    }

    if (!existinguser) {
        return res.status(400).json({ success: false, message: "User doesn't exist!! ", datat: null });
    }

    return res.status(200).json({ success: true, message: `User was found`, data: existinguser });
}

const DeleteUser = async (req, res) => {

    const { id } = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while fetching user", data: error });
    }

    if (!existinguser) {
        return res.status(400).json({ success: false, message: "User doesn't exist!! ", datat: null });
    }

    try {
        await existinguser.deleteOne();
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while saving user", data: error });
    }

    return res.status(200).json({ success: true, message: `User was Deleted successfully`, data: null });
}

const Register = async (req, res) => {

    const { email, nom, prenom, cin, birthday, phone, role } = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while fetching user", data: error });
    }

    if (existinguser) {
        return res.status(400).json({ success: false, message: "Email already exist!! ", datat: null });
    }

    try {
        existinguser = await user.findOne({ cin: cin });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while fetching user", data: error });
    }

    if (existinguser) {
        return res.status(400).json({ success: false, message: "CIN already exist!! ", datat: null });
    }

    let avatar = 'avatar.png';
    if (req.file) {
        avatar = req.file.filename;
    }
    let password = req.body.password;
    if (!password) {
        password = generator.generate({
            length: 8,
            numbers: true
        });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const NewUser = new user({
        email,
        nom,
        prenom,
        cin,
        birthday,
        phone,
        role,
        avatar,
        password: hashedpassword
    });

    try {
        await NewUser.save();
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while saving user", data: error });
    }

    let info = await transporter.sendMail({
        from: 'hajersoltani001@gmail.com', // sender address
        to: email, // list of receivers
        subject: "New Account Created", // Subject line
        // text: "Hello world?", // plain text body
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    
                <!-- Header -->
                <div style="background-color: #3498db; color: #ffffff; text-align: center; padding: 20px;">
                    <h1 style="font-size: 28px; margin-bottom: 10px;">Welcome to Our App!</h1>
                    <p style="font-size: 16px;">Your exciting journey begins here.</p>
                </div>
    
                <!-- Content -->
                <div style="padding: 20px; text-align: center;">
                    <p style="font-size: 18px; color: #444;">Dear ${nom} ${prenom},</p>
                    <p style="font-size: 18px; color: #444;">Congratulations! Your new account has been successfully created in our App as a(n) <strong>${role}</strong>.</p>
                    <p style="font-size: 18px; color: #444;">Please keep your password in a safe place. You can change your password anytime by logging into your account.</p>
                    <p style="font-size: 18px; color: #444;">Here is your password: <strong>${password}</strong></p>
                </div>
    
                <!-- Call to Action Button -->
                <div style="text-align: center; padding: 20px;">
                    <a href="https://www.google.com/" style="display: inline-block; background-color: #3498db; color: #ffffff; font-size: 18px; padding: 12px 30px; text-decoration: none; border-radius: 30px;">Check out our App</a>
                </div>
    
                <!-- Footer -->
                <div style="text-align: center; padding: 20px; background-color: #3498db; color: #ffffff;">
                    <p style="font-size: 16px; margin-bottom: 0;">Thank you for choosing our App!</p>
                    <p style="font-size: 16px; margin-top: 5px;">We look forward to serving you.</p>
                </div>
    
            </div>
        </div>
        `, // html body
    });


    return res.status(200).json({ success: true, message: `user added successfly`, data: NewUser });
}

const Login = async (req, res) => {

    const { email, password } = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email });
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while fetching user", data: error });
    }

    if (!existinguser) {
        return res.status(400).json({ success: false, message: "Email doesn't exist!! ", datat: null });
    }

    let check = await bcrypt.compare(password, existinguser.password);

    if (!check) {
        return res.status(400).json({ success: false, message: "Check your password ", datat: null });
    }

    return res.status(200).json({ success: true, message: `Welcome ${existinguser.prenom} ${existinguser.nom}`, data: existinguser });

}

const UpdateUser = async (req, res) => {

    const { email, nom, prenom, cin, birthday, phone, password, role } = req.body;
    const { id } = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while fetching user", data: error });
    }

    if (!existinguser) {
        return res.status(400).json({ success: false, message: "user doesn't exist!! ", datat: null });
    }

    if (email) {
        existinguser.email = email;
    }
    if (nom) {
        existinguser.nom = nom;
    }
    if (prenom) {
        existinguser.prenom = prenom;
    }
    if (birthday) {
        existinguser.birthday = birthday;
    }
    if (phone) {
        existinguser.phone = phone;
    }
    if (cin) {
        existinguser.cin = cin;
    }
    if (role) {
        existinguser.role = role;
    }
    if (password) {
        existinguser.password = await bcrypt.hash(password, 10);
    }


    // delete old pecture if the avatar is beeing updated
    if (req.file) {
        if (existinguser.avatar && existinguser.avatar !== "avatar.png") {
            let path = `./src/uploads/images/${existinguser.avatar}`;
            try {
                fs.unlinkSync(path);
                //file removed
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: error, error: error })
            }
        }
        existinguser.avatar = req.file.filename;
    }

    try {
        await existinguser.save();
    } catch (error) {
        return res.status(500).json({ success: false, message: "server error while saving user", data: error });
    }

    return res.status(200).json({ success: true, message: `user Updated successfly`, data: existinguser });

}

exports.GetAllUser = GetAllUser
exports.FindUserById = FindUserById
exports.DeleteUser = DeleteUser
exports.Login = Login
exports.Register = Register
exports.UpdateUser = UpdateUser