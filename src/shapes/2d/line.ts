import { Affine2, Vector2 } from 'hisabati'
import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'
import type { Feature, SupportMapped2d } from '../../core/clipping.js'
import type { PointQuery2D } from '../../core/query.js'

export class Line2 implements Boundable2D, SupportMapped2d, PointQuery2D {
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

  queryPointLocal(point: Vector2, tolerance = 0): boolean {
    return this.queryPointDistance(point, tolerance) <= 0
  }

  queryPoint(point: Vector2, transform: Affine2, tolerance = 0): boolean {
    return this.queryPointLocal(
      Affine2.invert(transform, new Affine2()).transform(point.clone()),
      tolerance
    )
  }

  queryPointDistance(point: Vector2, tolerance = 0): number {
    const start = new Vector2(-this.halfLength, 0)
    const end = new Vector2(this.halfLength, 0)
    const edge = Vector2.subtract(end, start)
    const lengthSq = Vector2.dot(edge, edge)

    if (lengthSq === 0) {
      return Vector2.distanceTo(point, start) - tolerance
    }

    const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), edge) / lengthSq))
    const closest = Vector2.add(start, Vector2.multiplyScalar(edge, t))

    return Vector2.distanceTo(point, closest) - tolerance
  }
}
