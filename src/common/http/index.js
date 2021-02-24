import axios from 'axios';
import { message } from 'antd';
import router from '@/common/router';
import { getToken } from '@/common/utils';
import { getSessionStorageToken, setSessionStorageToken } from '@/common/store/storage';
import { getRootAddress } from './utils';
import { checkStatus } from './handleStatus';
message.config({
    duration: 3,
    maxCount: 1
});
//不拦截的白名单
const whiteList = require('./httpWhiteRoster.js');

//生产环境
if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = getRootAddress().baseUrl || window.location.origin;
}
//开发环境
if (process.env.NODE_ENV === 'development') {
    //注意:webpack中devSever配置了proxy跨域,不能设置baseurl
    if (process.env.NODE_PROXY) {
        axios.defaults.baseURL = null;
    }
}
//默认60秒超时
axios.defaults.timeout = 60000;

//http request 拦截器
const author = 'Authorization';
axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        if (!getSessionStorageToken()) {
            setSessionStorageToken(token);
        } else if (token !== getSessionStorageToken()) {
            router.push('/login');
            return;
        }
        if (whiteList.indexOf(config.url) === -1) {
            config.headers.common[author] = 'Bearer ' + token;
        }
    }
    return config;
}, error => Promise.reject(error));

//http response 拦截器
axios.interceptors.response.use(response => response, error => Promise.resolve(error.response));

export default {
    POST(url, data) {
        return axios.post(url, data, {}).then(checkStatus);
    },
    GET(url, params) {
        return axios.get(url, {
            params: {
                _t: +(new Date()),
                ...params
            }
        }).then(checkStatus);
    },
    DELETE(url, params) {
        return axios.delete(url, {
            params: {
                _t: +(new Date()),
                ...params
            }
        }).then(checkStatus);
    },
    PUT(url, data) {
        return axios.put(url, data, {}).then(checkStatus);
    }
};

