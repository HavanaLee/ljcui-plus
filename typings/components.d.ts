// For this project development
import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    ElDialog: typeof import('../packages/ljc-ui')['ElDialog']

  }

  interface ComponentCustomProperties {
  }
}

export { }
