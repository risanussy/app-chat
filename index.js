// Import package manager
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const cors = require('cors');
 
const app = express();
const port = 5000 || process.env.PORT;

// config io
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// middleware
app.use(cors({
    origin: true, //included origin as true
    credentials: true, //included credentials as true
  }))

dotenv.config();
app.use(express.json())
app.use(cookieParser());
app.use(multer().single('none'))

// Router
let usersRouter = require("./src/routes/users")

app.use('/auth/v1/', usersRouter);


// Socket configurasi
let {getChat, getUser} = require("./src/controllers/chat")

const chatPost = require('./src/models/chat');
io.on('connection', (socket) => {
    socket.on('new data', (data) => {
        const user = data.user;
        const message = data.message;
        
        const Posting = new chatPost({user, message})
        
        Posting.save()
          .catch(err => console.log('Pesan error : ' + err))

        io.emit('new data', data);
    });
});

io.on('connection', socket => {
  socket.on('user-typing', () => {
    socket.broadcast.emit('is-typing');
  });
});

io.on('connection', getChat);
io.on('connection', getUser);

// Connect db
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://admin:IhnbrlZkHif2i8YP@al-azhar.dgeaugp.mongodb.net/?retryWrites=true&w=majority')
  .then(()=> {
    http.listen(port, ()=>{
      console.log(`server is running in http://localhost:${port}`)
    })
  })
  .catch(err => console.log(err))