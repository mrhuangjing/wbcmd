const webpack = require('webpack');
const getWebpackConfig = require('./handleWebpackConfig.js');
const WebpackDevServer = require('webpack-dev-server');
const util = require('./util');
const chalk = require('chalk');
const fs = require('fs');
const cmd = require('./cmd');
const path = require('path');
const error = chalk.bold.red;
const log = console.log;
let isDebug;

async function serve (debug) {
    isDebug = debug;
    if (util.hasPath('wbcmd.config.js')) {
        const webpackConfig = getWebpackConfig();

        let proxy, port, historyApiFallback;
        try {
            const fileRes = await util.fileRead(path.resolve('./wbcmd.config.js'));
            const re = /{[\S\s]*}/;
            const match = fileRes.match(re);
            if (match) {
                eval(`var obj = ${match[0]}`);
                proxy = obj.proxy;
                port = obj.port;
                historyApiFallback = obj.historyApiFallback;
            }
        } catch (e) {
            log(error('读取配置文件wbcmd.config.js失败'));
            return;
        }

        if (webpackConfig) {
            isDebug && log(chalk.yellow('传入的proxy配置 ->'), proxy || null);
            const server = new WebpackDevServer(webpack(webpackConfig), {
                contentBase: './dist',
                hot: true,
                host: 'localhost',
                open: true, // 打开浏览器
                proxy,
                disableHostCheck: true, // 此配置用于绕过检查  原因:新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname不是配置内的，将中断访问  
                historyApiFallback
            });

            // 开启文件监听
            watchDir('./src');
            // 监听端口
            server.listen(port || 8080);
        }
    } else {
        log(error('项目配置文件wbcmd.config.js缺失'));
    }
}

function watchDir (dir) {
    const arr = fs.readdirSync(dir);

    for (let i = 0; i < arr.length; i++) {
        const p = `${dir}/${arr[i]}`;
        const stat = fs.lstatSync(p);

        if (stat.isDirectory()) {
            isDebug && log(chalk.yellow(`访问文件夹 -> ${p}`));
            watchDir(p);
        } else {
            watchFile(p);
        }
    }
}

function watchFile (file) {
    isDebug && log(chalk.yellow(`监听文件 -> ${file}`));
    fs.watchFile(file, async (cur, pre) => {
        const size = cur.size;

        try {
            const {buffer, fd} = await openFile(file, size);
            const str = await readFile(fd, buffer, size);
            const depList = extract(str);
            const globalList = await getDepList(path.resolve(__dirname, '../package.json'));
            const localList = await getDepList(path.resolve('../../package.json'));
            const filterList = [];
            let instruction = `wnpm install --save `;
            for (let value of depList) {
                if (globalList.indexOf(value) < 0 && localList.indexOf(value) < 0) {
                    filterList.push(value);
                    instruction += `${value} `;
                }
            }
            if (isDebug) {
                log(chalk.yellow('全局依赖: '), globalList);
                log(chalk.yellow('本地依赖: '), localList);
                log(chalk.yellow('新增依赖: '), filterList);
            }
            if (filterList.length) {
                log(chalk.yellow(`检测到依赖更新，请稍等...`));
                log(chalk.yellow(`正在执行: ${instruction}`));
                await cmd.run([instruction]);
            }
        } catch (e) {
            log(error(e));
        }
    });
}

// 获取依赖列表
async function getDepList (dir) {
    try {
        const list = [];
        const {size} = await getFileStat(dir);
        const {buffer, fd} = await openFile(dir, size);
        const str = await readFile(fd, buffer, size);
        const deps = JSON.parse(str).dependencies;
        for (let key in deps) {
            list.push(key);
        }
        return list;
    } catch (e) {
        log(error(`获取依赖列表异常,${e}`));
    }
}

function getFileStat (file) {
    return new Promise ((resolve, reject) => {
        fs.stat(file, (err, stats) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stats);
        });
    });
}

function extract (text) {
    // const reg = /import\s+[\w\$]+\s+from\s+['"]([\w\$\/@-]+)['"];?/;
    const reg = /(^|[\n\r]+)[^\/]*?import\s+[\w\$]+\s+from\s+['"]([\w\$\/@-]+)['"];?/;
    const note = /(\/\/.*([\n\r]|$))|(\/\*(\s|.)*?\*\/)/g;
    text = text.replace(note, ''); // 去除 单行/多行注释 干扰项

    const depList = [];
    while (text) {
        const res = text.match(reg);
        if (res) {
            depList.push(res[2]);
            text = text.replace(reg, '');
        } else {
            break;
        }
    }
    return depList;
}

function openFile (file, fileSize) {
    return new Promise ((resolve, reject) => {
        fs.open(file, 'r', (err, fd) => {
            if (err) {
                reject(err);
                return;
            }
            let buffer = Buffer.alloc(fileSize);
            resolve({
                buffer,
                fd
            });
        });
    });
}

function readFile (fd, buffer, fileSize) {
    return new Promise ((resolve, reject) => {
        fs.read(fd, buffer, 0, fileSize, 0, (err, bytesRead, buffer) => {
            if (err) {
                fs.close(fd);
                reject(err);
                return;
            }
            resolve(buffer.toString());
            fs.close(fd);
        });
    });
}

module.exports = serve;