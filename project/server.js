// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('ユーザーが接続しました');
  
  socket.on('inputText', (text) => {
    io.emit('inputText', text);
  });
  
  socket.on('disconnect', () => {
    console.log('ユーザーが切断しました');
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`サーバーが起動しました: ${port}`);
});