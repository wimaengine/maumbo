import type { BoundingBox2D } from "./box"
import type { BoundingCircle } from "./circle"

export interface Boundable2D {
    aabb2d():BoundingBox2D
    boundingCircle():BoundingCircle
}