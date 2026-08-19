import type { Affine2 } from 'hisabati'
import type { BoundingBox2D } from "./box"
import type { BoundingCircle } from "./circle"

export interface Boundable2D {
    localaabb2d(): BoundingBox2D
    aabb2d(affine: Affine2): BoundingBox2D
    boundingCircle(): BoundingCircle
}
