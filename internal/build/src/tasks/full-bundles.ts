import VueMacros from 'unplugin-vue-macros/rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { target } from '../build-info'
import { LjcUiAlias } from '../plugins/ljc-ui-alias'
import { rollup } from 'rollup'
import { epOutput, epRoot, localeRoot } from '@ljc-ui/build-utils'
import { PKG_BRAND_NAME, PKG_CAMELCASE_LOCAL_NAME, PKG_CAMELCASE_NAME } from '@ljc-ui/build-constants'
import path from 'path'
import glob from 'fast-glob'
import { camelCase, upperFirst } from 'lodash'
import { version } from '../../../../packages/ljc-ui-plus/version'
import { formatBundleFilename, generateExternal, withTaskName, writeBundles } from '../utils'

import type { Plugin } from 'rollup'
import { parallel } from 'gulp'


const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`
async function buildFullEntry(minify: boolean) {
    const plugins: Plugin[] = [
        LjcUiAlias(),
        VueMacros({
            setupComponent: false,
            setupSFC: false,
            plugins: {
                vue: vue({
                    isProduction: true
                }),
                vueJsx: vueJsx()
            }
        }),
        nodeResolve({
            extensions: ['.mjs', '.js', '.json', '.ts'],
        }),
        commonjs(),
        esbuild({
            exclude: [],
            sourceMap: minify,
            target,
            loaders: {
                '.vue': 'ts'
            },
            define: {
                'process.env.NODE_ENV': JSON.stringify('production')
            },
            treeShaking: true,
            legalComments: 'eof'
        })
    ]
    if (minify) {
        plugins.push(
            minifyPlugin({
                target,
                sourceMap: true
            })
        )
    }

    const bundle = await rollup({
        input: path.resolve(epRoot, 'index.ts'),
        plugins,
        /**
         * 该选项用于匹配需要保留在 bundle 外部的模块，它的值可以是一个接收模块 id 参数并且返回 true（表示排除）或 false（表示包含）的函数，也可以是一个由模块 ID 构成的数组，还可以是可以匹配到模块 ID 的正则表达式。
         * 除此之外，它还可以是单个模块 ID 或者单个正则表达式。匹配得到的模块 ID 应该满足以下条件之一：
           1.import 语句中外部依赖的名称。例如，如果标记 import "dependency.js" 为外部依赖，那么模块 ID 为 "dependency.js"，而如果标记 import "dependency" 为外部依赖，那么模块 ID 为 "dependency"。
           2.绝对路径。（例如，文件的绝对路径）
         */
        external: await generateExternal({ full: true }),
        treeshake: true
    })

    await writeBundles(bundle, [
        {
            format: 'umd',
            /**
             * 该选项用于指定要写入的文件名。如果该选项生效，那么同时也会生成源码映射（sourcemap）文件。
             * 只有当生成的 chunk 不超过一个时，该选项才会生效。
             */
            file: path.resolve(
                epOutput,
                'dist',
                formatBundleFilename('index.full', minify, 'js')
            ),
            exports: 'named',
            /**
             * 该选项用于，在想要使用全局变量名来表示你的 bundle 时，输出格式必须指定为 iife 或 umd。
             * 同一个页面上的其他脚本可以通过这个变量名来访问你的 bundle 导出。
             */
            name: PKG_CAMELCASE_NAME,
            /**
             * 该选项用于使用 id: variableName 键值对指定的、在 umd 或 iife 格式 bundle 中的外部依赖
             */
            globals: {
                vue: 'Vue'
            },
            sourcemap: minify,
            /**
             * 该选项用于在 bundle 顶部添加一个字符串
             */
            banner
        },
        {
            format: 'esm',
            file: path.resolve(
                epOutput,
                'dist',
                formatBundleFilename('index.full', minify, 'mjs')
            ),
            sourcemap: minify,
            banner,
        },
    ])
}

async function buildFullLocale(minify: boolean) {
    const files = await glob(`**/*.ts`, {
        cwd: path.resolve(localeRoot, 'lang'),
        absolute: true,
    })
    return Promise.all(
        files.map(async (file) => {
            const filename = path.basename(file, '.ts')
            const name = upperFirst(camelCase(filename))

            const bundle = await rollup({
                input: file,
                plugins: [
                    esbuild({
                        minify,
                        sourceMap: minify,
                        target,
                    }),
                ],
            })
            await writeBundles(bundle, [
                {
                    format: 'umd',
                    file: path.resolve(
                        epOutput,
                        'dist/locale',
                        formatBundleFilename(filename, minify, 'js')
                    ),
                    exports: 'default',
                    name: `${PKG_CAMELCASE_LOCAL_NAME}${name}`,
                    sourcemap: minify,
                    banner,
                },
                {
                    format: 'esm',
                    file: path.resolve(
                        epOutput,
                        'dist/locale',
                        formatBundleFilename(filename, minify, 'mjs')
                    ),
                    sourcemap: minify,
                    banner,
                },
            ])
        })
    )
}
export const buildFull = (minify: boolean) => async () =>
    Promise.all([buildFullEntry(minify), buildFullLocale(minify)])

export const buildFullBundle = parallel(
    withTaskName('buildFullMiniFied', buildFull(true)),
    withTaskName('buildFull', buildFull(false))
)