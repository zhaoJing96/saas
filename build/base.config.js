'use strict';

const path = require('path');
const os = require('os');
const env = require('./env');
const baseUrl = require('./../config.js').baseUrl;
const version = require('./../package.json').version;

function joinName(pathString) {
    return path.resolve(__dirname, pathString);
}
//获取本机ip
function getIPAdress() {
    const interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
//src,工作目录
const _src = joinName('./../src');
//public,开发环境热更新目录
const _public = joinName('./../public');
//bundle,生产环境构建目录
const _bundle = joinName('./../bundle');

/**
 *代理跨域
 *同webpack-dev-server的proxy设置一样,
 *axios, fetch, jquery中的请求路径不能拼接root, 不能设置baseUrl地址
 */
const __proxy = {
    //接口根路径
    '/api': {
        //被代理的请求地址
        target: baseUrl,
        //跨域
        changeOrigin: true,
        //如果是https，会有安全校验，设置secure为false
        secure: true,
        //重写根路径
        pathRewrite: {
            '^/api': '/api'
        }
    }
};

module.exports = {
    //项目名称
    projectName: 'saas',
    //版本
    version: version,
    //入口文件
    entry: _src + '/app.js',
    //主工作目录
    workPath: _src,
    //开发环境
    dev: {
        //输出文件'
        filename: env.dev ? 'static/js/[name].js' : env.prod && '/static/js/[name]_[hash:8].js',
        //开发环境代码构建编译目录
        path: path.resolve(__dirname, _public),
        //开发环境热更新目录必须是输出路径的绝对路径
        publicPath: '/',
        //开发环境目录
        sevices: _public,
        //开发环境host
        host: getIPAdress(),
        // host: 'saasdev.dhwork.cn',
        //开发环境端口
        port: 80,
        //开启代理
        proxy: __proxy
    },
    //生产环境,打包到根目录的bundle
    prod: {
        //输出文件'
        filename: 'static/js/[name]_' + new Date().getTime() + '.js',
        //生产环境代码输出目录
        path: path.resolve(__dirname, _bundle)
    }
};
