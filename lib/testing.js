const path = require('path');
const jest = require('jest');
const chalk = require('chalk');
const error = chalk.bold.red;
const log = console.log;

module.exports = () => {
    const curPath = path.resolve('./');
    const inter = curPath.indexOf('\\') != -1 ? '\\' : '/';
    const dirs = curPath.split(inter).reverse();
    const projectName = dirs[0];

    if (dirs.length >= 3 && dirs.indexOf('projects') === 1 && dirs.indexOf('wbcmd_apps') === 2) {
        try {
            jest.runCLI({'_': [projectName]}, [curPath]);
        } catch (e) {
            log(error('单元测试执行出错：', e));
        }
    } else {
        log(error('请在wbcmd_apps/projects/下的项目目录中执行wbcmd test'));
    }
};