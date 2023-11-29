const express = require('express');
const UserController = require('../cotrollers/user');
const route = express.Router();


route.get('/', UserController.GetAllUser);

route.get('/:id', UserController.FindUserById);

route.patch('/:id', UserController.UpdateUser);

route.delete('/:id', UserController.DeleteUser);

route.post('/register', UserController.Register);

route.post('/login', UserController.Login);

module.exports = route