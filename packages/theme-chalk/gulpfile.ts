import path from 'path'
import { epOutput } from '@ljc-ui/build/utils'
import { dest, parallel, src, series } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import chalk from 'chalk'

const distFolder = path.resolve(__dirname, 'dist')
const distBundle = path.resolve(epOutput, 'theme-chalk') // 打包后的目录

/**
 * compile theme-chalk scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildThemeChalk() {
    const sass = gulpSass(dartSass)
    const noElPrefixFile = /(index|base|display)/
    return src(path.resolve(__dirname, 'src/*.scss')) // 只读src下一层的scss文件
        .pipe(sass.sync()) // sass转化同步执行
        .pipe(autoprefixer({ cascade: false })) // 自动添加前缀
        .pipe(cleanCSS({}, details => {

        })) // 压缩css
        .pipe(rename((path) => {
            console.log(chalk.blue(path.basename, path.dirname, path.extname));

            if (!noElPrefixFile.test(path.basename)) path.basename = `l-${path.basename}`
        })) // 给文件重命名加上l前缀
        .pipe(dest(distFolder))
}

/**
 * Build dark Css Vars
 * @returns
 */
function buildDarkCssVars() {
    const sass = gulpSass(dartSass)
    return src(path.resolve(__dirname, 'src/dark/css-vars.scss'))
        .pipe(sass.sync())
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCSS({}))
        .pipe(dest(distFolder + '/dark'))
}

/**
 * copy from packages/theme-chalk/dist to dist/ljc-ui/theme-chalk
 */
export function copyThemeChalkBundle() {
    return src(distFolder + '/**').pipe(dest(distBundle))
}

/**
 * copy source file to packages
 */
export function copyThemeChalkSource() {
    return src(path.resolve(__dirname, 'src/**')) // 读取src下的所有文件
        .pipe(dest(path.resolve(distBundle, 'src'))) // 通过管道读取Vinyl对象并写入dist/ljc/theme-chalk/src

}


export const build = parallel(copyThemeChalkSource,
    series(buildThemeChalk, buildDarkCssVars, copyThemeChalkBundle))

export default build