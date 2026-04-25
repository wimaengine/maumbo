import { Shape2 } from './shape2.js'
import { Affine2, Vector2 } from 'hisabati'
import type { Feature, SupportMapped2d } from '../../core/gjkEPA.js'
import { getPolygonFeature } from './utils.js'

export class Rectangle extends Shape2 implements SupportMapped2d {
  halfWidth = 0
  halfHeight = 0

  constructor(halfWidth: number, halfHeight: number) {
    super()
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

  getSupportPoint2d(direction: Vector2, transform?: Affine2): Vector2 {
    const points = this.getPoints()
    let maxDot = -Infinity
    let support = transform
      ? transform.transform(points[0].clone())
      : points[0].clone()

    for (let i = 0; i < points.length; i++) {
      const point = transform
        ? transform.transform(points[i].clone())
        : points[i]
      const projection = Vector2.dot(point, direction)

      if (projection > maxDot) {
        maxDot = projection
        support = point
      }
    }

    return support.clone()
  }

  getFeature2d(direction: Vector2, transform?: Affine2): Feature {
    const vertices = this.getPoints().map((point) => {
      return transform ? transform.transform(point.clone()) : point.clone()
    })

    return getPolygonFeature(vertices, direction)
  }
}
