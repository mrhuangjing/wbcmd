#!/usr/bin/env node
const program = require('commander');
const init = require('../lib/init');
const serve = require('../lib/serve');
const build = require('../lib/build');
const testing = require('../lib/testing');

program
    .version(require('../package').version, '-v, --version')
    .usage('<command> [options]');

program.command('init [task]')
    .description('初始化一个新项目')
    .action((...args) => {
        init.apply(null, args);
    });
 
program.command('serve')
    .option('-d, --debug', 'output extra debugging')
    .description('本机起服务调试代码')
    .action((cmdObj) => {
        serve(cmdObj.debug);
    });

program.command('build')
    .description('生产环境代码打包')
    .action((...args) => {
        build.apply(null, args);
    });

program.command('test')
    .description('单元测试')
    .action(() => {
        testing();
    });

program.parse(process.argv);