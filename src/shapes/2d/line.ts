import { Vector2 } from 'hisabati'
import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'
import type { Feature, SupportMapped2d } from '../../core/clipping.js'

export class Line2 implements Boundable2D, SupportMapped2d {
  halfLength = 0

  constructor(halfLength: number) {
    this.halfLength = halfLength
  }

  getSupportPoint2d(direction: Vector2): Vector2 {
    return (direction.x >= 0)
      ? new Vector2(this.halfLength, 0)
      : new Vector2(-this.halfLength, 0)
  }

  getFeature2d(direction: Vector2): Feature {
    if (Math.abs(direction.y) > Math.abs(direction.x)) {
      const normal = direction.y >= 0
        ? Vector2.Y.clone()
        : Vector2.Y.clone().reverse()

      return {
        type: 'edge',
        v1: new Vector2(this.halfLength, 0),
        v2: new Vector2(-this.halfLength, 0),
        normal
      }
    }

    const normal = direction.magnitudeSquared() === 0
      ? Vector2.X.clone()
      : direction.clone().normalize()

    return {
      type: 'point',
      point: this.getSupportPoint2d(direction),
      normal
    }
  }

  aabb2d(): BoundingBox2D {
    return new BoundingBox2D(
      -this.halfLength,
      0,
      this.halfLength,
      0
    )
  }
  boundingCircle(): BoundingCircle {
    return new BoundingCircle(
      0,
      0,
      this.halfLength
    )
  }
}
