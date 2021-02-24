/**
 * 建立连接
 */
import { getToken } from '@/common/utils';
import websocketGlobal from '@/common/websocket/websocketGlobal.js';
import websocketData from '@/common/store/webScoketData';
import { websocketUrl } from '@/common/api/websocketApi';

export function localSocket() {
    let socket;
    let token = getToken();
    let url;
    let interval;
    let sendHeartbeatTime = null;
    // 判断浏览器是否支持websocket
    if ("WebSocket" in window) {
        url = websocketUrl(token);
        socket = new WebSocket(url);
        websocketGlobal.setWs(socket);
    } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
    }
    socket.onopen = function () {
        // 连接 websocket,参数传递
        console.log("连接...");
        interval = window.setInterval(function () {
            const data = {
                "service": 0
            };
            console.log("发送心跳...");
            socket.send(JSON.stringify(data));
            sendHeartbeatTime = new Date().getTime();
            setTimeout(function () {
                if (sendHeartbeatTime !== null) {
                    console.log("获取心跳返回失败...");
                    sendHeartbeatTime = null;
                    window.clearInterval(interval);
                    socket = new WebSocket(url);
                    websocketGlobal.setWs(socket);
                }
            }, 1000 * 60);
        }, 1000 * 60 * 3);
    };
    socket.onmessage = function (res) {
        if (sendHeartbeatTime !== null) {
            console.log("接收到心跳消息...");
            sendHeartbeatTime = null;
        }
        // 接收消息
        websocketData.webOnMessage(res);
    };
    socket.onclose = function () {
        // 关闭 websocket
        socket.close();
        console.log("连接已关闭...");
        if (interval) {
            window.clearInterval(interval);
        }
    };
    socket.onerror = function (err) {
        console.log(err);
    };
}