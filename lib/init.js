const path = require('path');
const inquirer = require('inquirer');
const util = require('./util');
const download = require('download-git-repo');
const chalk = require('chalk');
const error = chalk.bold.red;
const warning = chalk.yellow;
const log = console.log;

function getTask () {
    const questions = [{
        type: 'input',
        name: 'taskName',
        message: '请输入项目名称'
    }];
    return inquirer.prompt(questions);
}

async function confirm (taskName) {
    const infos = [{
        type: 'confirm',
        name: 'isOk',
        message: `确认将项目名称设为${taskName}`
    }];
    return inquirer.prompt(infos);
}

// 获取页面类型 单页/多页
function getAppType () {
    const questions = [{
        type: 'list',
        name: 'appType',
        choices: [{
            name: '单页',
            value: 'single'
        }, {
            name: '多页',
            value: 'multiple'
        }],
        message: '请选择应用类型'
    }];
    return inquirer.prompt(questions);
}

function downloadGitRepo (taskName, appType) {
    return new Promise((resolve, reject) => {
        const branch = appType === 'single' ? 'single' : 'multiple';
        download(`mrhuangjing/wbcmd_template#${branch}`, `projects/${taskName}`, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function createTask (taskName, appType) {
    try {
        await downloadGitRepo(taskName, appType);
        log(chalk.green('✓️ 项目创建成功 '));
    } catch (e) {
        log(error('项目创建失败，失败原因: ', e));
    }
}

async function initInquirer (taskName) {
    taskName = taskName || (await getTask()).taskName;

    if (!taskName) {
        initInquirer();
        return;
    }

    const dirPath = path.resolve('./projects', taskName);
    if (util.fsExistsSync(dirPath)) {
        log(warning('项目名已存在，请更换项目名称'));
        return;
    }

    const {isOk} = await confirm(taskName);
    if (isOk) {
        const {appType} = await getAppType();
        createTask(taskName, appType);
    } else {
        log(chalk.white('放弃操作'));
    }
}

module.exports = (taskName) => {
    const curPath = path.resolve('./');
    const inter = curPath.indexOf('\\') != -1 ? '\\' : '/';
    const folderName = curPath.split(inter).reverse()[0];

    if (folderName == 'wbcmd_apps') {
        initInquirer(taskName);
    } else {
        log(warning('请在wbcmd_apps目录下新建项目'));
    }
};