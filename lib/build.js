const webpack = require('webpack');
const getWebpackConfig = require('./handleWebpackConfig.js');
const merge = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const util = require('./util');
const chalk = require('chalk');
const error = chalk.bold.red;
const log = console.log;

function build () {
    const hasWbcmdConfig = util.hasPath('wbcmd.config.js');
    const hasSrc = util.hasPath('src');
    if (hasWbcmdConfig && hasSrc) {
        if (util.hasPath('dist')) {
            util.delDir('dist');
        }

        const webpackConfig = getWebpackConfig();
        webpackConfig.output.publicPath = './';
        
        if (webpackConfig) {
            const config = merge(webpackConfig, {
                mode: 'production',
                optimization: {
                    splitChunks: {
                        chunks: 'all'
                    },
                    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
                }
            });
            webpack(config, (err, stats) => {
                if (err || stats.hasErrors()) {
                    log(error('build异常，错误原因: ', err));
                }
                log(chalk.green('✓️ build完成'));
            });
        }
    } else if (!hasSrc) {
        log(error('src目录缺失'));
    } else {
        log(error('项目配置文件wbcmd.config.js缺失'));
    }
}

module.exports = build;
