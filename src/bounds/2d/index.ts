export * from './boundable'
export * from './box'
export * from './circle'
export * from './segment'
export * from './triangle'
export * from './arc'

import type { BoundingBox2D } from './box'
import type { BoundingCircle } from './circle'
import type { Segment2D } from './segment'
import type { ArcBound2D } from './arc'

export type Bounds = BoundingBox2D | BoundingCircle
export type BoundaryPrimitive2D = Segment2D | ArcBound2D
