import { series, parallel } from 'gulp'
import { withTaskName, run, runTask } from './utils'
import { mkdir, copyFile } from 'fs/promises'
import { resolve } from 'path'
import { buildOutput, epOutput } from './utils/path'

export const copyFiles = () => {
    Promise.all([

    ])
}

export const copyFullStyle = async () => {
    await mkdir(resolve(epOutput, 'dist'), { recursive: true }) // 在dist/ljc-ui/下创建dist目录
    await copyFile(
        resolve(epOutput, 'theme-chalk/index.css'),
        resolve(epOutput, 'dist/index.css')
    ) // 从dist/ljc-ui/theme-chalk下复制index.css到dist/ljc-ui/dist
}


export default series(
    withTaskName('clean', () => run('rm -rf ./dist')),
    withTaskName('createOutput', () => mkdir(buildOutput, { recursive: true })),
    parallel(
        runTask('buildModules')
        // runTask('buildFullBundle'),
        // runTask('generateTypesDefinitions'),
        // runTask('buildHelper'),
        // series(
        //     withTaskName('buildThemeChalk', () =>
        //         run('pnpm run -C packages/theme-chalk build')
        //     ),
        //     copyFullStyle
        // )
    )
)

export * from './index'