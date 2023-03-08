import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { useZIndex, useGlobalConfig, defaultNamespace, useId } from '@ljc-ui/hooks'

import type { DialogProps, DialogEmits } from './dialog'
import type { Ref, SetupContext, CSSProperties } from 'vue'
import { isClient, useTimeoutFn } from '@vueuse/core'
import { addUnit } from '@ljc-ui/utils'

export const useDialog = (props: DialogProps, targetRef: Ref<HTMLElement | undefined>) => {
    const instance = getCurrentInstance()!
    const emit = instance.emit as SetupContext<DialogEmits>['emit']
    const { nextZIndex } = useZIndex()

    let lastPostion = ''
    const bodyId = useId()
    const visible = ref(false)
    const closed = ref(false)
    const rendered = ref(false)
    const zIndex = ref(props.zIndex || nextZIndex())

    let openTimer: (() => void) | undefined = undefined
    let closeTimer: (() => void) | undefined = undefined

    const namespace = useGlobalConfig('namespace', defaultNamespace)

    const style = computed<CSSProperties>(() => {
        const style: CSSProperties = {}
        const varPrefix = `--${namespace.value}-dialog` as const
        if (!props.fullscreen) {
            if (props.top) {
                style[`margin-top`] = props.top
            }
            if (props.width) {
                style[`width`] = addUnit(props.width)
            }
        }
        return style
    })

    const overlayDialogStyle = computed(() => {

    })

    function open() {
        closeTimer?.()
        openTimer?.()

        if (props.openDelay && props.openDelay > 0) {
            ; ({ stop: openTimer } = useTimeoutFn(() => doOpen(), props.openDelay))
        } else {
            doOpen()
        }
    }

    function close() {
        openTimer?.()
        closeTimer?.()

        if (props.closeDelay && props.closeDelay > 0) {
            ; ({ stop: closeTimer } = useTimeoutFn(() => doClose(), props.closeDelay))
        } else {
            doClose()
        }
    }

    function doOpen() {
        if (!isClient) return
        visible.value = true
    }

    function doClose() {
        visible.value = false
    }

    watch(
        () => props.modelValue,
        val => {
            if (val) {
                closed.value = false
                open()
                rendered.value = true
                zIndex.value = props.zIndex ? zIndex.value++ : nextZIndex()
                nextTick(() => {
                    emit('open')
                    if (targetRef.value) targetRef.value.scrollTop = 0
                })
            } else visible.value && close()
        }
    )

    onMounted(() => {
        if (props.modelValue) {
            visible.value = true
            rendered.value = true
            open()
        }
    })

    return {

        close,
        doClose,
        bodyId,
        closed,
        style,
        overlayDialogStyle,
        rendered,
        visible,
        zIndex,
    }
}