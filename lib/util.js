const fs = require('fs');
const path = require('path');

function fsExistsSync (path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch(e) {
        return false;
    }
    return true;
}

function fileWrite (dirPath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dirPath, content, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

function fileRead (dirPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(dirPath, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.toString());
         });
    });
}

function dirRead (dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdirSync(dirPath, (err, files) => {
            if (err) {
                reject(err);
            }
            resolve(files);
         });
    });
}

function delDir(p) {
    // 读取文件夹中所有文件及文件夹
    var list = fs.readdirSync(p)
    list.forEach((v, i) => {
        // 拼接路径
        var url = p + '/' + v
        // 读取文件信息
        var stats = fs.statSync(url)
        // 判断是文件还是文件夹
        if (stats.isFile()) {
            // 当前为文件，则删除文件
            fs.unlinkSync(url)
        } else {
            // 当前为文件夹，则递归调用自身
            arguments.callee(url)
        }
    })
    // 删除空文件夹
    fs.rmdirSync(p)
}

function hasPath (v) {
    const p = path.resolve('./', `${v}`);
    return fsExistsSync(p);
}

module.exports = {
    fsExistsSync,
    fileWrite,
    fileRead,
    dirRead,
    hasPath,
    delDir
};