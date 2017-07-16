var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var nodeModulesPath = path.resolve(__dirname, 'node_modules')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    // 配置webpack编译入口
    entry: {
        app: './src/main.js'
    },
    // 配置webpack输出路径和命名规则
    output: {
        path: config.build.assetsRoot,
        filename: '[name].[hash:7].js', // 防止读取缓存
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'src': path.resolve(__dirname, '../src'),
            'views': path.resolve(__dirname, "../src/views"),
            'components': path.resolve(__dirname, "../src/components")
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        }, {
            test: /\.(js|jsx)$/,  // 可使用正则表达式
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test')],
            exclude: [nodeModulesPath]  // 排除不处理的目录
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    }
}