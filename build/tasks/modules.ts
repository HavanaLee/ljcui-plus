import glob from "fast-glob"; // 报错模块 "glob" 只能在使用 "esModuleInterop" 标志时进行默认导入，所以换这种写法
import { rollup } from "rollup";
import {
    generateExternal,
    excludeFiles,
    pkgRoot,
    writeBundles,
    epRoot
} from "../utils";
import VueMacros from 'unplugin-vue-macros/rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { LjcUiAlias } from "../plugins/ljc-uialias";
import { buildConfigEntries, target } from "../build-info";
import type { OutputOptions } from "rollup";

export const buildModules = async () => {
    const input = excludeFiles(
        await glob("**/*.{js,ts,vue}", {
            cwd: pkgRoot,
            absolute: true,
            onlyFiles: true,
        })
    );

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

    await writeBundles(
        bundle,
        buildConfigEntries.map(([module, config]): OutputOptions => {
            return {
                /**
                    该选项用于指定生成 bundle 的格式。可以是以下之一：
                    amd - 异步模块定义，适用于 RequireJS 等模块加载器
                    cjs - CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）
                    es - 将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
                    iife - 自执行函数，适用于 <script> 标签。（如果你要为你的应用创建 bundle，那么你很可能用它。）
                    umd - 通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
                    system - SystemJS 模块加载器的原生格式（别名: systemjs）
                **/
                format: config.format,
                dir: config.output.path, // 该选项用于指定所有生成 chunk 文件所在的目录
                /**
                 * 该选项用于指定导出模式。默认是 auto，指根据 input 模块导出推测你的意图：
                    default - 适用于只使用 export default ... 的情况
                    named - 适用于导出超过一个模块的情况
                    none - 适用于没有导出的情况（比如，当你在构建应用而非库时）
                    default 和 named 之间的差异会影响其他人使用你的 bundle 的方式。例如，如果该选项的值时 default，那么 CommonJS 用户可以通过以下方式使用你的库：
                 */
                exports: module === 'cjs' ? 'named' : undefined,
                /**
                 * 该选项将使用原始模块名作为文件名，为所有模块创建单独的 chunk，而不是创建尽可能少的 chunk。它需要配合 output.dir 选项一起使用。
                 * Tree-shaking 仍会对没有被入口使用或者执行阶段没有副作用的文件生效。该选项可以用于将文件结构转换为其他模块格式。
                 */
                preserveModules: true,
                preserveModulesRoot: epRoot,
                /**
                 * 如果该选项值为 true，那么每个文件都将生成一个独立的 sourcemap 文件。如果值为 “inline”，那么 sourcemap 会以 data URI 的形式附加到输出文件末尾。
                 * 如果值为 “hidden”，那么它的表现和 true 相同，不同的是，bundle 文件中没有 sourcemap 的注释。
                 */
                sourcemap: true,
                /**
                 * 该选项用于指定 chunks 的入口文件名。使用 output.preserveModules 选项时支持以下形式：
                 * [format]：输出（output）选项中定义的 format 的值。
                   [name]：文件名（不包含扩展名）
                   [ext]：文件扩展名。
                   [extname]：文件扩展名，如果存在则以 . 开头。
                 */
                entryFileNames: `[name].${config.ext}`,
            };
        })
    );
};
