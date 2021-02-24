import router from '@/common/router';
//递归对象,生成数组[{key:xxx,value:xxx},...]
export function recurrence(params, obj) {
    if (typeof params === 'object') {
        for (let i in params) {
            const item = params[i];
            if (typeof item === 'string' || typeof item === 'boolean' || typeof item === 'number') {
                obj[i] = item;
            }
            if (typeof item === 'object') {
                recurrence(item, obj);
            }
        }
    }
    return obj;
}
//获取当前浏览器根路径和协议,返回接口请求路径和websocket路径
export function getRootAddress() {
    let websocketProtocol = null;
    const { origin, protocol, host } = window.location;
    if (protocol === 'http:') {
        websocketProtocol = 'ws://';
    }
    if (protocol === 'https:') {
        websocketProtocol = 'wss://';
    }
    return { baseUrl: origin, wsUrl: websocketProtocol + host };
}
//跳转到错误页面
export function openErrorView(data) {
    console.log('open error page');
    const path = {
        pathname: '/error',
        state: data
    };
    router.push(path);
}
