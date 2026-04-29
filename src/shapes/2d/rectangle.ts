import { Vector2 } from 'hisabati'
import { getPolygonFeature, type Feature, type SupportMapped2d } from '../../core'
import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'

export class Rectangle implements SupportMapped2d, Boundable2D {
  halfWidth = 0
  halfHeight = 0

  constructor(halfWidth: number, halfHeight: number) {
    this.halfWidth = halfWidth
    this.halfHeight = halfHeight
  }

  getPoints(): Vector2[] {
    const { halfWidth, halfHeight } = this
    const positions = [
      new Vector2(-halfWidth, -halfHeight),
      new Vector2(halfWidth, -halfHeight),
      new Vector2(halfWidth, halfHeight),
      new Vector2(-halfWidth, halfHeight)
    ]
    
    return positions
  }

  getSupportPoint2d(direction: Vector2): Vector2 {
    const points = this.getPoints()
    let maxDot = -Infinity
    let support = points[0].clone()

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const projection = Vector2.dot(point, direction)

      if (projection > maxDot) {
        maxDot = projection
        support = point
      }
    }

    return support.clone()
  }

  getFeature2d(direction: Vector2): Feature {
    return getPolygonFeature(this.getPoints(), direction)
  }

  aabb2d(): BoundingBox2D {
    return new BoundingBox2D(
      -this.halfWidth,
      -this.halfHeight,
      this.halfWidth,
      this.halfHeight
    )
  }
  boundingCircle(): BoundingCircle {
    const {halfHeight, halfWidth} = this
    return new BoundingCircle(
      0,
      0,
      Math.sqrt(halfHeight * halfHeight + halfWidth * halfWidth)
    )
  }
}
