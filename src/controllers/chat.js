const chatPost = require('../models/chat');

exports.sendChat = (socket) => {
    console.log("connect 1");

    socket.on('data', (data) => {
        const nama = data.nama;
        const chat = data.message;
        
        const Posting = new chatPost({nama, chat})
        
        Posting.save()
            .catch(err => console.log('Pesan error : ' + err))
        io.emit('data', data);
    });
}

exports.getChat = (socket) => {
    console.log("connect 2");

    socket.on('get data', () => {
      chatPost.find({}, (err, data) => {
        if (err) throw err;
  
        socket.emit('data', data);
      });
    });
}