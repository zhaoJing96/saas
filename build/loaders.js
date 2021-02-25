/**
 * 配置loaders
 */
'use strict';

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require('./base.config');
//env
const env = require('./env');
//工作空间
const __include__dirname = path.resolve(__dirname, baseConfig.workPath);
const babelLoader = {
    test: /\.(js|jsx)$/,
    use: {
        loader: 'babel-loader', options: {
            presets: ['env', 'react', 'stage-0'],
            plugins: ['transform-decorators-legacy', 'transform-decorators']
        }
    },
    include: __include__dirname,
    exclude: /node_modules/
};
const happypackLoader = {
    test: /\.(js|jsx)$/,
    loader: 'happypack/loader?id=happyBabel',
    include: __include__dirname,
    exclude: /node_modules/
};
const esLintLoader = {
    test: /\.(js|jsx)$/,
    use: [{
        loader: 'eslint-loader',
        options: { // 这里的配置项参数将会被传递到 eslint的CLIEngine
            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
        }
    }],
    enforce: "pre", // 编译前检查
    include: __include__dirname,
    exclude: /node_modules/
};
const cssLoader = {
    test: /\.css$/,
    use: [
        MiniCssExtractPlugin.loader,
        { loader: 'style-loader' },
        { loader: 'css-loader' }
    ],
    include: __include__dirname,
    exclude: /node_modules/
};
const lessLoader = {
    test: /\.less$/,
    use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader' }, // translates CSS into CommonJS
        {
            loader: 'less-loader', // compiles Less to CSS
            options: {
                lessOptions: { javascriptEnabled: true }
            }
        }
    ]
};
const sassLoader = {
    test: /\.scss$/,
    use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader' },
        { loader: 'sass-loader' }
    ]
};
const imageLoader = {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 1024,
                name: '[name][hash:8].[ext]',
                outputPath: function (fileName) {
                    const staticPath = env.dev ? 'static/img/' : env.prod && '/static/img/';
                    return staticPath + fileName;
                }
            }
        }
    ],
    include: __include__dirname,
    exclude: /node_modules/
};
const fileLoader = {
    test: /\.(eot|svg|ttf|otf|woff|woff2|mp3|mp4|glb)/,
    use: [{ loader: 'file-loader', options: { limit: 128, name: env.dev ? 'static/fonts/[name][hash:8].[ext]' : env.prod && '/static/fonts/[name][hash:8].[ext]' } }],
    include: __include__dirname,
    exclude: /node_modules/
};
module.exports = [
    happypackLoader, babelLoader, esLintLoader, cssLoader, lessLoader, sassLoader, imageLoader, fileLoader
];
