import { Vector2 } from 'hisabati'
import { getPolygonFeature, type Feature, type SupportMapped2d } from '../../core'
import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'

export class Triangle implements SupportMapped2d, Boundable2D {
  halfBase = 0
  halfHeight = 0
  baseRatio = 0

  constructor(halfBase: number, halfHeight: number, baseRatio = 0) {
    this.halfBase = halfBase
    this.halfHeight = halfHeight
    this.baseRatio = baseRatio
  }

  getPoints(): Vector2[] {
    const { baseRatio, halfBase, halfHeight } = this
    const positions = [
      new Vector2(-halfBase, -halfHeight),
      new Vector2(halfBase, -halfHeight),
      new Vector2(halfBase * baseRatio, halfHeight)
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
      -this.halfBase,
      -this.halfHeight,
      this.halfBase,
      this.halfHeight
    )
  }
  boundingCircle(): BoundingCircle {
    const {halfBase, halfHeight} = this
    return new BoundingCircle(
      0,
      0,
      Math.sqrt(halfBase * halfBase + halfHeight * halfHeight)
    )
  }
}
