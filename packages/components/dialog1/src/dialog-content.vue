<template>
  <div
    :ref="composedDialogRef"
    :class="[
      ns.b(),
      ns.is('fullscreen', fullscreen),
      ns.is('draggable', draggable),
      ns.is('align-center', alignCenter),
      { [ns.m('center')]: center },
      customClass,
    ]"
    :style="style"
    tabindex="-1"
  >
    <header ref="headerRef" :class="ns.e('header')">
      <slot name="header">
        <span role="heading" :class="ns.e('title')">
          {{ title }}
        </span>
      </slot>
      <button
        v-if="showClose"
        :class="ns.e('headerbtn')"
        type="button"
        @click="$emit('close')"
      >
        关闭
      </button>
    </header>
    <div :id="bodyId" :class="ns.e('body')">
      <slot />
    </div>
    <footer v-if="$slots.footer" :class="ns.e('footer')">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts">
export default {
  name:'LDialogContent'
}
</script>
<script lang="ts" setup>
import { composeRefs } from '@ljc-ui/utils';
import { computed, inject } from 'vue'

import { dialogInjectionKey } from './constants'
import { dialogContentEmits, dialogContentProps, FOCUS_TRAP_INJECTION_KEY } from './dialog-content'


const props = defineProps(dialogContentProps)
defineEmits(dialogContentEmits)

const { dialogRef, headerRef, bodyId, ns, style } = inject(dialogInjectionKey)!
const { focusTrapRef } = inject(FOCUS_TRAP_INJECTION_KEY)!

const composedDialogRef = composeRefs(focusTrapRef, dialogRef)
const draggable = computed(() => props.draggable)

</script>
