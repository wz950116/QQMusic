/**
 * 最开始执行文件
 * 1、检查node和npm版本
 * 2、引入相关插件和配置
 * 3、创建express服务器和webpack编译器
 * 4、配置各种中间件
 * 5、挂载代理服务和中间件
 * 6、配置静态资源
 * 7、启动服务器监听特定端口 开启浏览器
 */


// 检查NodeJS和npm的版本
require('./check-versions')()

// 获取配置
var config = require('../config')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')

// express的中间件，将http请求代理到其他服务器上
var proxyMiddleware = require('http-proxy-middleware')

// 根据Node环境来引入相应的配置
var webpackConfig = process.env.NODE_ENV === 'testing' ? require('./webpack.prod.conf') : require('./webpack.dev.conf')

// 端口号
var port = process.env.PORT || config.dev.port

// 自动开启浏览器
var autoOpenBrowser = !!config.dev.autoOpenBrowser

// 定义HTTP代理表（object） 代理到API服务器
var proxyTable = config.dev.proxyTable

// express实例
var app = express()

// 根据webpack配置文件创建Compiler编译对象
var compiler = webpack(webpackConfig)

// 中间件 对相应文件编译绑定存放在内存中
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

// 热重载中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: () => {}
    })

// 当html-webpack-plugin提交之后通过热重载中间件发布重载动作使得页面重载
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        })
        cb()
    })
})

// 将proxyTable中的代理请求配置挂在到express服务器上
Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context]
    // 格式化options，例如将'www.example.com'变成{ target: 'www.example.com' }
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

//------------------------------- 挂 载 -------------------------------//

// 重定向不存在URL
app.use(require('connect-history-api-fallback')())

// 将webpack编译后输出到内存中的文件资源挂到express服务器上
app.use(devMiddleware)

// 将热重载中间件挂载到express服务器上
app.use(hotMiddleware)

// 将静态资源挂载到express服务器上
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function() {
    console.log('> Listening at ' + uri + '\n')
})

// 启动并监听服务
module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
})
