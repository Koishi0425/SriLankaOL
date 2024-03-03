// 引入所需模块
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

// 创建express应用
var app = express();
// 创建HTTP服务器并将express应用作为回调函数
var server = http.createServer(app);
// 初始化socket.io并附加到HTTP服务器上
var io = socketio(server);

// 定义静态文件服务目录
app.use('/', express.static(__dirname + '/../public'));

// 初始化玩家列表和消息列表
var playerList = {};
var msgList = {};

// 定义管理员列表
const adminList = ['glamorgan', 'wpcwzy'];

// 根据socketId反向查询玩家ID
function reverseQuery(socketId) {
    for (var player in playerList) {
        if (playerList[player] == socketId) {
            return playerList[player];
        }
    }
    return null;
}

// 处理socket连接
io.on('connection', function(socket) {
    console.log("A user connected.");

    // 处理登录
    socket.on('login', function(data) {
        console.log(data + '加入游戏成功');
        playerList[data] = socket.id;
        io.emit('refresh');
    });

    // 处理消息发送
    socket.on('send_msg', function(data) {
        for (var admin in adminList) {
            socket.to(playerList[adminList[admin]]).emit('msg_recv', data.content);
        }
        if (!msgList[data.sender]) {
            msgList[data.sender] = new Array();
        }
        msgList[data.sender].push(data.content);
        console.log(msgList[data.sender]);
    });

    // 处理在线查询
    socket.on('query_online', function() {
        console.log('query_online');
        console.log(playerList);
        socket.emit('playerlist', {playerList});
    });

    // 处理断开连接
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        let disconnectedPlayerId = null;
        for (let playerId in playerList) {
            if (playerList[playerId] === socket.id) {
                disconnectedPlayerId = playerId;
                break;
            }
        }
        if (disconnectedPlayerId) {
            delete playerList[disconnectedPlayerId];
            console.log(playerList);
        }
    });
    

    // 加载聊天历史
    socket.on('load_chat_history', function(data) {
        socket.emit('chat_history', msgList[data]);
    });
});

// 启动HTTP服务器监听特定端口
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("Server running on port: " + port);
});
