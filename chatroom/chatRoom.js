const http = require('http');
const fs= require('fs');
// 新建服务
const app = http.createServer();
app.listen(3000);
// 新建io服务
const server = http.createServer();
const io = require('socket.io')(server);
server.listen(3001);
var clientCount = 0;

app.on('request', function (req, res) {
  var url = req.url;
  if (url === '/' || url === '/js/io.js' || url === '/js/md5.js') {
    if(url === '/'){
      var file_name = './views/index.html';
    }else{
      var file_name = './views/' + url;
    }
    fs.readFile(file_name, function (err, data) {
      if(err){
        res.end(`<h1>404as not found<h1>`);
      }else{
        res.end(data);
      }
    })
  }else{
    res.end(`<h1>404 not found<h1>`)
  }
})

io.on('connection', function (socket) {
  clientCount++;
  socket.nickname = '第' +  clientCount + '人';
  io.emit('enter', '欢迎第' + clientCount + '名成员进入聊天室');
  socket.on('message', function (data) {
    io.emit('message', data);
    socket.name = data.name;
  })
  

  socket.on('disconnect', function(){
    if(socket.name){
      io.emit('leave', socket.name + '离开聊天室');
    }else{
      io.emit('leave', socket.nickname + '什么也没说就走了');
    }
    
  })
});





