import type { BoundingSphere } from "./circle"
import type { BoundingBox3D } from "./box"

export interface Boundable3D {
    aabb2d():BoundingBox3D
    BoundingCircle():BoundingSphere
}