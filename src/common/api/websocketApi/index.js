const httpAddress = require('./../../../../config.js');
import { getRootAddress } from '@/common/http/utils.js';
let wsUrl = null;
//生产环境
if (process.env.NODE_ENV === 'production') {
    wsUrl = getRootAddress().wsUrl;
}
//开发环境
if (process.env.NODE_ENV === 'development') {
    wsUrl = httpAddress.wsUrl;
}
export const websocketUrl = token => wsUrl + '/api/websocket/v1/ws/echo?access_token=' + token;
