// socket 链接地址
var socket = io.connect('http://localhost:3001');
// 获取相应元素节点
var sendBtn = document.getElementById('sendBtn');
var mess = document.getElementById('mess');
var panel = document.getElementById('panel');
var yourname = document.getElementById('yourname');
// 定义本地数据
var msgData = {};
// 生成 1~4随机数
var i = Math.round(4 * Math.random());
// 对话框颜色class
var colorArr = ["bg-primary", "bg-success", "bg-info", "bg-warning", "bg-danger"]

// 将消息写入对应节点
function sendMessage(str, type) {
  var p = document.createElement('p');
  if(type == 'enter'){
    p.className = 'text-success';
    p.innerHTML = str;
  }else if(type == 'leave'){
    p.className = 'text-danger';
    p.innerHTML = str;
  }else{
    p.innerHTML = str.name + '：' + str.text;
    p.className = colorArr[str.num];
  }
  panel.appendChild(p);
  document.documentElement.scrollTop = document.documentElement.scrollHeight;
}


// 将最新消息添加黄色边框
function currentBubble() {
  var msgBubble = panel.getElementsByTagName('p');
  var len = msgBubble.length;
  msgBubble[len-2].style.border = 'none';
  msgBubble[len-1].style.border = '1px solid yellow';
}


// 设置名字
function setName() {
  sendBtn.onclick = function () {
    msgData.name = mess.value;
    msgData.text = '大家好我是 ' + msgData.name;
    msgData.num = i;
    if(msgData.text){
      yourname.innerHTML = msgData.name;
      socket.emit('message', msgData);
    }
    mess.value = '';
  }
}

// 发送消息
function txtInput() {
  sendBtn.onclick = function () {
    msgData.text = mess.value;
    if(msgData.text){
      socket.emit('message', msgData);
    }
    mess.value = '';
  }
}

// 判断是否已命名，执行对应函数
function chat(data) {
  if(data.name){
    txtInput();
  }else{
    setName();
  }
}

socket.on('enter', function (data) {
  sendMessage(data, 'enter');
  chat(msgData);
})

socket.on('message', function (data) {
  sendMessage(data, 'message');
  chat(msgData);
})

socket.on('leave', function (data) {
  sendMessage(data, 'leave');
})
