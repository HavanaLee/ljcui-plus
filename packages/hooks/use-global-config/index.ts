import { inject, getCurrentInstance, ref, computed, App, provide, unref } from 'vue'
import type { Ref, InjectionKey, ExtractPropTypes } from 'vue'
import { buildProps } from '@ljc-ui/utils'
import { MaybeRef } from '@vueuse/core'
import { namespaceContextKey } from '../use-namespace'
import { zIndexContextKey } from '../use-z-index'

export const configProviderProps = buildProps({
    /**
     * @description Controlling if the users want a11y features
     */
    a11y: {
        type: Boolean,
        default: true,
    },
    /**
     * @description Controls if we should handle keyboard navigation
     */
    keyboardNavigation: {
        type: Boolean,
        default: true,
    },
    /**
     * @description global Initial zIndex
     */
    zIndex: Number,
    /**
     * @description global component className prefix (cooperated with [$namespace](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/mixins/config.scss#L1)) | ^[string]
     */
    namespace: {
        type: String,
        default: 'el',
    },
} as const)
export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
export type ConfigProviderContext = Partial<ConfigProviderProps>

export const configProviderContextKey: InjectionKey<
    Ref<ConfigProviderContext>
> = Symbol()

// this is meant to fix global methods like `ElMessage(opts)`, this way we can inject current locale
// into the component as default injection value.
// refer to: https://github.com/element-plus/element-plus/issues/2610#issuecomment-887965266
const globalConfig = ref<ConfigProviderContext>()

export function useGlobalConfig<
    K extends keyof ConfigProviderContext,
    D extends ConfigProviderContext[K]
>(
    key: K,
    defaultValue?: D
): Ref<Exclude<ConfigProviderContext[K], undefined> | D>
export function useGlobalConfig(): Ref<ConfigProviderContext>
export function useGlobalConfig(
    key?: keyof ConfigProviderContext,
    defaultValue = undefined
) {
    const config = getCurrentInstance()
        ? inject(configProviderContextKey, globalConfig)
        : globalConfig
    if (key) {
        return computed(() => config.value?.[key] ?? defaultValue)
    } else {
        return config
    }
}

export const provideGlobalConfig = (
    config: MaybeRef<ConfigProviderContext>,
    app?: App,
    global = false
) => {
    const inSetup = !!getCurrentInstance()
    const oldConfig = inSetup ? useGlobalConfig() : undefined

    const provideFn = app?.provide ?? (inSetup ? provide : undefined)
    if (!provideFn) {

        return
    }

    const context = computed(() => {
        const cfg = unref(config)
        if (!oldConfig?.value) return cfg
        return mergeConfig(oldConfig.value, cfg)
    })
    provideFn(configProviderContextKey, context)
    provideFn(
        namespaceContextKey,
        computed(() => context.value.namespace)
    )
    provideFn(
        zIndexContextKey,
        computed(() => context.value.zIndex)
    )


    if (global || !globalConfig.value) {
        globalConfig.value = context.value
    }
    return context
}

const mergeConfig = (
    a: ConfigProviderContext,
    b: ConfigProviderContext
): ConfigProviderContext => {
    const keys = [...new Set([...keysOf(a), ...keysOf(b)])]
    const obj: Record<string, any> = {}
    for (const key of keys) {
        obj[key] = b[key] ?? a[key]
    }
    return obj
}