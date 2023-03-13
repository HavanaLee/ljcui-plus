import installer from './defaults'
export * from '@ljc-ui/components'
export * from '@ljc-ui/constants'
export * from '@ljc-ui/hooks'
export * from './version'
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer

export { default as dayjs } from 'dayjs'
