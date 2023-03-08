import { spawn } from 'child_process'
import type { TaskFunction } from 'gulp'
import { projectRoot, buildRoot } from './path'






// 在node中开启一个子进程来运行脚本
export const run = async (command: string, cwd: string = projectRoot) => {
    return new Promise<void>((resolve) => {
        // 将命令分割 例如：rm -rf 分割为['rm', '-rf'],进行解构[cmd,...args]
        const [cmd, ...args] = command.split(" ");
        const app = spawn(cmd, args, {
            cwd,
            stdio: "inherit",
            shell: process.platform === 'win32'  // 默认情况下 linux才支持 rm -rf  windows安装git bash
        });
        // 在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件
        app.on('close', (code) => {
            code === 0 && resolve()
        })  //
        process.on('exit', () => {
            app.kill('SIGHUP')
        })
    });
};



// 自定义每个task的name
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
    Object.assign(fn, { displayName: name })

export const runTask = (name: string) =>
    withTaskName(`shellTask:${name}`, () =>
        run(`pnpm run start ${name}`, buildRoot)
    )
