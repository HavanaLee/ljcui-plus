import { componentSizeMap } from '@ljc-ui/constants'

import type { ComponentSize } from '@ljc-ui/constants'

export const getComponentSize = (size?: ComponentSize) => {
  return componentSizeMap[size || 'default']
}
