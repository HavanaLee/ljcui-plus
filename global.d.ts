// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ElDialog: typeof import('element-plus')['ElDialog']
  }

  interface ComponentCustomProperties {
  }
}

export { }
