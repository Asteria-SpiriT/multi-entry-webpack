const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let enteries = getEnteries('src/views/**/index.js');

const config = {
    entry: enteries,
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: 'dist',
        filename: 'js/[name][hash].js'
    },
    plugins: []
}
// 获取指定路径下的入口文件
function getEnteries(globPath){
    let files = glob.sync(globPath),
        enteries = {};
    files.forEach(filepath => {
        // 取倒数第二层(views)做包名
        let split = filepath.split('/');
        let name = split[split.length - 2];

        enteries[name] = './' + filepath;
    });
    return enteries;
}

// 循环生成HtmlWebpackPlugin插件，把每一个插件的chunks指向自己打包的js
Object.keys(enteries).forEach(name =>{
    let plugin = new HtmlWebpackPlugin({
        filename: name + '.html',
        template: './src/views/' + name + '/index.html',
        inject: true,
        chunks: [name]
    })
    config.plugins.push(plugin);
})

module.exports = config;