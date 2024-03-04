var socket = io(); // 假设已经正确引入socket.io客户端库
document.addEventListener('DOMContentLoaded', function() {
    // 初始化UI组件
    var mapBtn = document.getElementById('map-btn');
    var bagBtn = document.getElementById('bag-btn');
    var mapTab = document.getElementById('map-tab');
    var bagTab = document.getElementById('bag-tab');
    var loginBtn = document.getElementById('login-btn');
    var playerIdSpan = document.querySelector('.player-id'); // 获取显示玩家ID的元素
    var loginTab = document.getElementById('login-tab');
    var chatArea = document.getElementsByClassName('chat-area')[0];
    var chatInput = document.getElementById('chat-input');
    var chatMessages = document.getElementById('chat-messages');
    var sendBtn = document.getElementById('send-btn');
    var uploadBtn = document.getElementById('upload-btn');
    var adminIDs = ['glamorgan', 'wpcwzy'];

    document.getElementById('login-id').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            loginBtn.click(); // 触发登录按钮的点击事件
        }
    });

    // 登录逻辑
    loginBtn.addEventListener('click', function() {
        var loginId = document.getElementById('login-id').value;
        if (loginId) {
            socket.emit('login', loginId); // 发送登录ID到服务器
            console.log('登录ID: ', loginId);
            loginTab.style.display = 'none';
            mapTab.style.display = 'block'; // 默认显示地图区域或根据需求调整
            chatArea.style.display = 'block';
            playerIdSpan.textContent = '玩家ID: ' + loginId;
        }
        if (adminIDs.includes(loginId)) {
            document.getElementById('admin-panel').style.display = 'block'; // 显示管理员面板
        } else {
            document.getElementById('admin-panel').style.display = 'none'; // 隐藏管理员面板
        }
    });

    // 视图切换逻辑
    mapBtn.addEventListener('click', function() {
        mapTab.style.display = 'block';
        bagTab.style.display = 'none';
    });

    bagBtn.addEventListener('click', function() {
        mapTab.style.display = 'none';
        bagTab.style.display = 'block';
    });

    // 发送消息逻辑
    function sendMessage() {
        var message = chatInput.value.trim();
        if (message) {
            socket.emit('send_msg', {sender: loginId, content: message}); // 发送消息到服务器
            console.log('发送的消息: ', message);
            chatInput.value = '';
        }
    }

    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    // 文件上传逻辑
    uploadBtn.addEventListener('change', function(event) {
        var file = event.target.files[0];
        // 这里可以添加将文件发送到服务器的代码
        console.log('上传的文件: ', file.name);
    });

    // 处理从服务器接收消息
    socket.on('msg_recv', function(data) {
        console.log('接收到的消息: ', data);
        var messageElement = document.createElement('div');
        messageElement.innerText = data; // 根据您的需求，可能需要解析data来显示用户名等
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 滚动到最新的消息
    });
});

