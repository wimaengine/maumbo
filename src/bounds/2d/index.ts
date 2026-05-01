export * from './boundable'
export * from './box'
export * from './circle'
export * from './segment'
export * from './triangle'

import type { BoundingBox2D } from './box'
import type { BoundingCircle } from './circle'

export type Bounds = BoundingBox2D | BoundingCircle
