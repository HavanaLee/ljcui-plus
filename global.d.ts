// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ElDialog: typeof import('ljc-ui-plus')['ElDialog']
    LButton: typeof import('ljc-ui-plus')['LButton']
  }

  interface ComponentCustomProperties {
  }
}

export { }
