const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

var PORT = 5000;

const userRouter = require('./routes/user');

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.use("/src/uploads/images", express.static(path.join("src", "uploads", "images")));


server.get('/', (req, res) => {
    return res.send('Hello Hajer!!!');
})

server.use('/user', userRouter);

mongoose.connect('mongodb+srv://admin:admin@project.i0dvij3.mongodb.net/?retryWrites=true&w=majority').then(result => {
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch(error => console.log(error));
