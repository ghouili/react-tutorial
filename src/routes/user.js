const express = require('express');
const UserController = require('../cotrollers/user');
const route = express.Router();

route.get('/add', UserController.AddUser);

route.post('/register', UserController.Register);

route.post('/login', UserController.Login);

module.exports = route