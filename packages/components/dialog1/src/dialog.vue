<template>
    <Teleport to="body">
        <el-overlay>
            <div role="dialog" aria-modal="true" :class="ns.namespace.value + '-overlay-dialog'">
                <l-dialog-content>
                    <template #header></template>
                    <slot />
                    <template v-if="$slots.footer" #footer>
                        <slot name="footer" />
                    </template>
                </l-dialog-content>
            </div>
        </el-overlay>
    </Teleport>
</template>

<script setup lang="ts">
import { ElOverlay } from '@ljc-ui/components/overlay'
import LDialogContent from './dialog-content.vue'
import { useNamespace } from '@ljc-ui/hooks'
import {  ref,  provide } from 'vue';
import { dialogEmits, dialogProps } from './dialog'
import { useDialog } from './use-dialog'
import { dialogInjectionKey } from './constants'

defineOptions({
  name: 'LDialog',
  inheritAttrs: false,
})

const props = defineProps(dialogProps)
defineEmits(dialogEmits)


const ns = useNamespace('dialog')
const dialogRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const dialogContentRef = ref()

const {
    visible,
    style,
    bodyId,
    rendered,
} = useDialog(props, dialogRef)

provide(dialogInjectionKey, {
    dialogRef,
    headerRef,
    bodyId,
    ns,
    rendered,
    style,
})

defineExpose({
    visible,
    dialogContentRef
})

</script>