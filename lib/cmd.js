const {exec} = require('child_process');

function _run(cmd, env) {
    return new Promise((resolve, reject) => {
        exec(cmd, env, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            resolve(stdout || stderr);
        });
    })
}

async function run(cmds, env) {
    if (cmds.length) {
        const cmd = cmds.join(' && ');
        return await _run(cmd, env);
    } else {
        console.log('cmd参数为空');
    }
}

module.exports = {
    run
}