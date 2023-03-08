import { epRoot } from './path'
import { getPackageDependencies } from './pkg'
import type { OutputOptions, RollupBuild } from 'rollup'

export const generateExternal = async (options: { full: boolean }) => {
    const { dependencies, peerDependencies } = getPackageDependencies(epRoot)
    return (id: string) => {
        const packages: string[] = peerDependencies
        if (!options.full) packages.push('@vue', ...dependencies)

        return Array.from(new Set(packages)).some(
            (pkg) => id === pkg || id.startsWith(`${pkg}/`)
        )
    }
}

/**
    在 bundle 对象上，您可以使用不同的输出选项对象多次调用 bundle.generate，
    以在内存中生成不同的 bundle。 如果直接将它们写入磁盘，请改用 bundle.write。
 */
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
    return Promise.all(options.map(option => bundle.write(option)))
}