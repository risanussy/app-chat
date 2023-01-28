const chatPost = require('../models/chat');
const userPost = require('../models/user');

exports.getChat = (socket) => {
    socket.on('get data', () => {
      chatPost.find().populate('user').exec((err, data) => {
        if (err) throw err;

        socket.emit('get data', data);
      });
    });
}

exports.getUser = (socket) => {
    socket.on('get user', (email) => {
      userPost.find({email}, 'name email', (err, data) => {
        if (err) throw err;

        socket.emit('get user', data);
      });
    });
}