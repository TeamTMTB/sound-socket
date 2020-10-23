const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on('connection', (socket)=>{
    console.log("Connected");
    socket.on('play', playMsg =>{
        io.emit('play', playMsg);
    })
    socket.on('stop', msg => io.emit('stop'));

})

server.listen(3001);

