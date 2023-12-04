const express = require('express');
const UserController = require('../cotrollers/user');
const fileuploader = require('../Middlewares/UploadFiles');

const route = express.Router();


route.get('/', UserController.GetAllUser);

route.get('/:id', UserController.FindUserById);

route.patch('/:id', fileuploader.single('avatar'), UserController.UpdateUser);

route.delete('/:id', UserController.DeleteUser);

route.post('/add', fileuploader.single('avatar'), UserController.Register);

route.post('/login', UserController.Login);

module.exports = route