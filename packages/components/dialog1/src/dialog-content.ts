import type { Ref, InjectionKey } from 'vue'
import { buildProps } from '@ljc-ui/utils'
export type FocusTrapInjectionContext = {
  focusTrapRef: Ref<HTMLElement | undefined>
  onKeydown: (e: KeyboardEvent) => void
}

export const FOCUS_TRAP_INJECTION_KEY: InjectionKey<FocusTrapInjectionContext> =
  Symbol('elFocusTrap')


export const dialogContentProps = buildProps({
  center: {
    type: Boolean,
    default: false,
  },
  alignCenter: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
} as const)

export const dialogContentEmits = {
  close: () => true,
}
