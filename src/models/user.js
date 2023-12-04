const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{type: String, unique: true, required: true },
    nom:{type: String, required: true},
    prenom:{type: String, required: true},
    cin:{type: Number, unique: true, required: true},
    birthday:{type: Date, required: true},
    phone:{type: Number, required: true},
    password:{type: String, required: true},
    role:{type: String, required: true, default: 'student'},
    avatar:{type: String, default: 'avatar.png'},
})

module.exports = mongoose.model('user', UserSchema);