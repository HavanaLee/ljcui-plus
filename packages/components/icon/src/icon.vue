<template>
  <i :class="ns.b()" :style="style" v-bind="$attrs">
    <slot />
  </i>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit } from '@ljc-ui/utils'
import { useNamespace } from '@ljc-ui/hooks'
import { iconProps } from './icon'
import type { CSSProperties } from 'vue'
import { isUndefined } from 'lodash-unified'

defineOptions({
  name: 'ElIcon',
  inheritAttrs: false,
})
const props = defineProps(iconProps)
const ns = useNamespace('icon')

const style = computed<CSSProperties>(() => {
  const { size, color } = props
  if (!size && !color) return {}

  return {
    fontSize: isUndefined(size) ? undefined : addUnit(size),
    '--color': color,
  }
})
</script>
