
import type { App, Plugin } from '@vue/runtime-core'
import { provideGlobalConfig } from '@ljc-ui/hooks'
import type { ConfigProviderContext } from '@ljc-ui/hooks'
import { INSTALLED_KEY } from '@ljc-ui/constants'

const version = '0.0.0-dev.1'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {
    if (app[INSTALLED_KEY]) return

    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))

    if (options) provideGlobalConfig(options, app, true)
  }

  return {
    version,
    install,
  }
}
