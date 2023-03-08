import { ref, inject, computed, unref } from "vue";
import type { Ref, InjectionKey } from 'vue'
import { isNumber } from '@vueuse/core'


const zIndex = ref(0)
const defaultZIndex = 2000

export const zIndexContextKey: InjectionKey<Ref<number | undefined>> = Symbol('zIndexContextKey')

export const useZIndex = () => {
    // 接收注入的z-index
    const zIndexInjection = inject(zIndexContextKey, undefined)
    const initialZIndex = computed(() => {
        // 如果是ref返回ref.value，如果不是返回参数本身
        const zIndexFromInjection = unref(zIndexInjection)
        // 如果是数值返回，如果不是返回默认的z-index
        return isNumber(zIndexFromInjection)
            ? zIndexFromInjection
            : defaultZIndex
    })

    // 嵌套的模态框每多一个，z-index都要累加，这样新打开的模态框遮罩层就能盖住上一个的
    const currentZIndex = computed(() => initialZIndex.value + zIndex.value)

    // 每打开一个模态框调用一次
    const nextZIndex = () => {
        zIndex.value++
        return currentZIndex.value
    }

    return { initialZIndex, currentZIndex, nextZIndex }
}