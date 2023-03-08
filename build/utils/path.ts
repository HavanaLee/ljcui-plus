import { resolve } from 'path'

// 根目录
export const projectRoot = resolve(__dirname, '..', '..')
// packages
export const pkgRoot = resolve(projectRoot, 'packages')
// 主题
export const themeRoot = resolve(pkgRoot, 'theme-chalk')
// 打包的源目录 packages/ljc-ui
export const epRoot = resolve(pkgRoot, 'ljc-ui')
// build目录
export const buildRoot = resolve(projectRoot, 'build')
/** /dist */
export const buildOutput = resolve(projectRoot, 'dist')
export const epOutput = resolve(buildOutput, 'ljc-ui')
// ljc-ui的package.json
export const epPackage = resolve(epRoot, 'package.json')