# wbcmd
`wbcmd`是前端cli工具

# 安装
```bash
$ wnpm install -g wbcmd
```

# 说明
`wbcmd`封装了四个方法，用于项目的创建、启动、打包、测试。

### wbcmd init [projectName]
`wbcmd init`将在`wbcmd_apps/projects/`下创建名为`projectName`的项目，自动同步github上`mrhuangjing/wbcmd_template`库的最新模板代码，用于项目工程的生成。

### wbcmd serve
`wbcmd serve`用于在本机启动服务，默认`8080`端口，也可通过`wbcmd.config.js`指定别的端口。
* -d --debug 输出调试信息

### wbcmd build
`wbcmd build`打包生成dist文件夹，会自动完成tree-shaking、代码压缩和混淆。

### wbcmd test
`wbcmd test`是单元测试命令，`wbcmd`集成了开源测试库`jest`，通过该指令，可以运行当前项目下的单元测试。