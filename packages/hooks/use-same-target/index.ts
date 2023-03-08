import { NOOP } from '@vue/shared'

// 判断有没有自定义事件，如果有自定义事件用自定义事件，没有导出默认事件
export const useSameTarget = (handleClick?: (e: MouseEvent) => void) => {
    if (!handleClick) return { onClick: NOOP, onMousedown: NOOP, onMouseup: NOOP }

    let mousedownTarget = false
    let mouseupTarget = false

    // events fired in the order: mousedown -> mouseup -> click
    const onClick = (e: MouseEvent) => {
        if (mousedownTarget && mouseupTarget) handleClick(e)
        mousedownTarget = mouseupTarget = false
    }

    const onMousedown = (e: MouseEvent) => {
        mousedownTarget = e.target === e.currentTarget
    }

    const onMouseup = (e: MouseEvent) => {
        mouseupTarget = e.target === e.currentTarget
    }

    return { onClick, onMousedown, onMouseup }
}