const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{type: String, unique: true, require: true },
    name:{type: String, require: true},
    password:{type: String, require: true},
    phone:{type: Number}
})

module.exports = mongoose.model('user', UserSchema);