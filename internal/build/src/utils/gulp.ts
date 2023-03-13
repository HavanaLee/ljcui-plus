import type { TaskFunction } from 'gulp'
import { buildRoot } from '@ljc-ui/build-utils'
import { run } from './process'

export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
    Object.assign(fn, { display: name })

export const runTask = (name: string) =>
    withTaskName(`shellTask:${name}`,
        () => run(`pnpm run start ${name}`, buildRoot))

