import { epRoot, excludeFiles, pkgRoot, } from "@ljc-ui/build-utils"
import glob from 'fast-glob'
import { rollup } from 'rollup'
import { generateExternal, writeBundles } from '../utils'
import VueMacros from 'unplugin-vue-macros/rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { target, buildConfigEntries } from '../build-info'
import type { OutputOptions } from 'rollup'
import { LjcUiAlias } from '../plugins/ljc-ui-alias'

export const buildModules = async () => {
    const input = excludeFiles(
        await glob('**/*.{js,ts,vue}', {
            cwd: pkgRoot,
            absolute: true,
            onlyFiles: true
        })
    )

    const bundle = await rollup({
        input,
        plugins: [
            LjcUiAlias(),
            VueMacros({
                setupComponent: true,
                setupSFC: false,
                plugins: {
                    vue: vue({
                        isProduction: false
                    }),
                    vueJsx: vueJsx()
                }
            }),
            nodeResolve({
                extensions: ['.mjs', '.js', '.ts', '.json']
            }),
            commonjs(),
            esbuild({
                sourceMap: true,
                target,
                loaders: {
                    '.vue': 'ts'
                }
            })
        ],
        external: await generateExternal({ full: false }),
        treeshake: false // bundle会变大，但是会提升构建性能
    })

    await writeBundles(bundle, buildConfigEntries.map(([module, config]): OutputOptions => {
        return {
            /**
             * 该选项用于指定生成 bundle 的格式。可以是以下之一：
                amd - 异步模块定义，适用于 RequireJS 等模块加载器
                cjs - CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）
                es - 将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
                iife - 自执行函数，适用于 <script> 标签。（如果你要为你的应用创建 bundle，那么你很可能用它。）
                umd - 通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
                system - SystemJS 模块加载器的原生格式（别名: systemjs）
             */
            format: config.format,
            /**
             * 该选项用于指定所有生成 chunk 文件所在的目录。如果生成多个 chunk，则此选项是必须的。
             * 否则，可以使用 file 选项代替。
             */
            dir: config.output.path,
            /**
             * 该选项用于指定导出模式。默认是 auto，指根据 input 模块导出推测你的意图：
               default - 适用于只使用 export default ... 的情况
               named - 适用于导出超过一个模块的情况
               none - 适用于没有导出的情况（比如，当你在构建应用而非库时）
             */
            exports: module === 'cjs' ? 'named' : undefined,
            /**
             * 该选项将使用原始模块名作为文件名，为所有模块创建单独的 chunk，而不是创建尽可能少的 chunk。它需要配合 output.dir 选项一起使用。
             * Tree-shaking 仍会对没有被入口使用或者执行阶段没有副作用的文件生效。该选项可以用于将文件结构转换为其他模块格式。
               请注意，默认情况下，在转换为 cjs 或 amd 格式时，设置 output.exports 的值为 auto 可以把每个文件会作为入口点。
               这意味着，例如对于 cjs，只包含默认导出的文件会将值直接赋值给 module.exports。
             */
            preserveModules: true,
            preserveModulesRoot: epRoot,
            /**
             * 如果该选项值为 true，那么每个文件都将生成一个独立的 sourcemap 文件。如果值为 “inline”，那么 sourcemap 会以 data URI 的形式附加到输出文件末尾。
             * 如果值为 “hidden”，那么它的表现和 true 相同，不同的是，bundle 文件中没有 sourcemap 的注释。
             */
            sourcemap: true,
            /**
             * 该选项用于指定 chunks 的入口文件名。支持以下形式：
             * [format]：输出（output）选项中定义的 format 的值，例如：es 或 cjs。
               [hash]：哈希值，由入口文件本身的内容和所有它依赖的文件的内容共同组成。
               [name]：入口文件的文件名（不包含扩展名），当入口文件（entry）定义为对象时，它的值时对象的键。
               使用 output.preserveModules 选项时，该模式也会生效。不过，此时它有如下一组不同的占位符：
               [format]：输出（output）选项中定义的 format 的值。
               [name]：文件名（不包含扩展名）
               [ext]：文件扩展名。
               [extname]：文件扩展名，如果存在则以 . 开头。
             */
            entryFileNames: `[name].${config.ext}`
        }
    }))
}