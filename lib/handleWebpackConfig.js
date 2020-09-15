const path = require('path');
const fs = require('fs');
const webpackConfig = require('../webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');
const error = chalk.bold.red;
const log = console.log;

function getHtmls () {
    const dirPath = path.resolve('./src');
    const files = fs.readdirSync(dirPath);
    return files.filter(el => {
        if (el.match(/\.html$/)) {
            return true;
        }
        return false;
    }).map(el => {
        return el.replace('.html', '');
    });
}

function getJsEntries () {
    const dirPath = path.resolve('./src/js');
    const files = fs.readdirSync(dirPath);
    return files.filter(el => {
        if (el.match(/\.js$/)) {
            return true;
        }
        return false;
    }).map(el => {
        return el.replace('.js', '');
    });
}

function deal () {
    const htmls = getHtmls();
    const jss = getJsEntries();

    const isHtmlJsMatch = htmls.some(el => {
        if (jss.indexOf(el) == -1) {
            return false;
        }
        return true;
    });

    if (isHtmlJsMatch) {
        htmls.forEach(el => {
            webpackConfig.entry[el] = `./src/js/${el}.js`;
            webpackConfig.plugins.push(new HtmlWebpackPlugin({
                template: `./src/${el}.html`,
                filename: `${el}.html`,
                chunks: [`${el}`]
            }));
        });

        return webpackConfig;
    } else {
        log(error('入口js文件缺失'));
        return null;
    }
}

module.exports = deal;