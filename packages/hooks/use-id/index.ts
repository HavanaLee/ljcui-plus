import { computed, getCurrentInstance, inject, unref } from 'vue'
import { isClient } from '@vueuse/core'
import { useGetDerivedNamespace } from '../use-namespace'

import type { InjectionKey, Ref } from 'vue'
import type { MaybeRef } from '@vueuse/core'

export type ElIdInjectionContext = {
  prefix: number
  current: number
}

const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
}

export const ID_INJECTION_KEY: InjectionKey<ElIdInjectionContext> =
  Symbol('elIdInjection')

export const useIdInjection = (): ElIdInjectionContext => {
  return getCurrentInstance()
    ? inject(ID_INJECTION_KEY, defaultIdInjection)
    : defaultIdInjection
}

export const useId = (deterministicId?: MaybeRef<string>): Ref<string> => {
  const idInjection = useIdInjection()
  if (!isClient && idInjection === defaultIdInjection) {
  }

  const namespace = useGetDerivedNamespace()
  const idRef = computed(
    () =>
      unref(deterministicId) ||
      `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`
  )

  return idRef
}
