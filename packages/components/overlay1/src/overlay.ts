import { createVNode, CSSProperties, defineComponent, h, renderSlot } from 'vue'
import { definePropType, PatchFlags } from '@ljc-ui/utils'
import type { ZIndexProperty } from 'csstype'
import type { ExtractPropTypes } from 'vue'
import { useSameTarget, useNamespace } from '@ljc-ui/hooks'

// porps
export const overlayProps = {
    mask: {
        type: Boolean,
        default: true
    },
    zIndex: {
        type: definePropType<ZIndexProperty>([String, Number])
    },
    overlayClass: {
        type: definePropType<string | string[] | Record<string, boolean>>([String, Array, Object])
    },
    customMaskEvent: {
        type: Boolean,
        default: false,
    },
}
export type OverlayProps = ExtractPropTypes<typeof overlayProps>

// 事件
export const overlayEmits = {
    click: (evt: MouseEvent) => evt instanceof MouseEvent
}
export type OverlayEmits = typeof overlayEmits

export default defineComponent({
    name: 'LOverlay',
    props: overlayProps,
    emits: overlayEmits,
    // porps是响应式的，解构会失去响应式。第二个参数context上下文不是响应式
    setup(props, { slots, emit }) {

        const ns = useNamespace('overlay')
        const onMaskClick = (e: MouseEvent) => {
            emit('click', e)
        }
        const { onClick, onMousedown, onMouseup } = useSameTarget(props.customMaskEvent ? undefined : onMaskClick)


        return () => {
            return props.mask
                ? createVNode('div',
                    {
                        class: [ns.b(), props.overlayClass],
                        style: { zIndex: props.zIndex },
                        onClick,
                        onMousedown,
                        onMouseup
                    },
                    [renderSlot(slots, 'default')],
                    PatchFlags.STYLE | PatchFlags.CLASS | PatchFlags.PROPS,
                    ['onClick', 'onMouseup', 'onMousedown'])
                : h('div',
                    {
                        class: props.overlayClass,
                        style: {
                            zIndex: props.zIndex,
                            position: 'fixed',
                            top: '0px',
                            right: '0px',
                            bottom: '0px',
                            left: '0px'
                        } as CSSProperties
                    },
                    [renderSlot(slots, 'default')])
        }
    }
})