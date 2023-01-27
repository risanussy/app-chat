// Import
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const cors = require('cors');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
const port = 5000;

// middleware
app.use(cors({
    origin: true, //included origin as true
    credentials: true, //included credentials as true
  }))
app.use(express.json())
app.use(cookieParser());
app.use(multer().single('none'))
dotenv.config();

// Router
let usersRouter = require("./src/routes/users")

app.use('/auth/v1/', usersRouter);


// Socket configurasi
let {sendChat, getChat} = require("./src/controllers/chat")

io.on('connection', sendChat);
io.on('connection', getChat);

// Connect db
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://admin:IhnbrlZkHif2i8YP@al-azhar.dgeaugp.mongodb.net/?retryWrites=true&w=majority')
  .then(()=> {
    app.listen(port, ()=>{
      console.log(`server is running in http://localhost:${port}`)
    })
  })
  .catch(err => console.log(err))