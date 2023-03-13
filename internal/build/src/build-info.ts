import { epOutput } from '@ljc-ui/build-utils'
import { PKG_NAME } from '@ljc-ui/build-constants'
import path from 'path'
import type { ModuleFormat } from 'rollup'

export const modules = ['esm', 'cjs'] as const
export type Module = typeof modules[number]

export interface BuildInfo {
    module: 'ESNext' | 'CommonJS',
    format: ModuleFormat,
    ext: 'mjs' | 'cjs' | 'js',
    output: {
        name: string,
        path: string
    },
    bundle: {
        path: string
    }
}
export const buildConfig: Record<Module, BuildInfo> = {
    esm: {
        module: 'ESNext',
        format: 'esm',
        ext: 'mjs',
        output: {
            name: 'es',
            path: path.resolve(epOutput, 'es'),
        },
        bundle: {
            path: `${PKG_NAME}/es`,
        },
    },
    cjs: {
        module: 'CommonJS',
        format: 'cjs',
        ext: 'js',
        output: {
            name: 'lib',
            path: path.resolve(epOutput, 'lib'),
        },
        bundle: {
            path: `${PKG_NAME}/lib`,
        },
    },
}




export type BuildConfig = typeof buildConfig
export type BuildConfigEntries = [Module, BuildInfo][]
export const buildConfigEntries = Object.entries(buildConfig) as BuildConfigEntries
export const target = 'es2018'