import { Affine2, Vector2 } from 'hisabati'
import type { Feature, SupportMapped2d } from '../../core'
import { BoundingBox2D, type Boundable2D, BoundingCircle, Segment2D } from '../../bounds'
import type { PointQuery2D } from '../../core/query.js'

export class Capsule implements SupportMapped2d, Boundable2D, PointQuery2D {
  radius = 0
  halfHeight = 0

  constructor(radius: number, halfHeight: number) {
    this.radius = radius
    this.halfHeight = halfHeight
  }

  getSegment(): Segment2D {
    return new Segment2D(
      new Vector2(0, this.halfHeight),
      new Vector2(0, -this.halfHeight)
    )
  }

  getVertices(axis: Vector2): [Vector2, Vector2] {
    const normal = axis
    const top = new Vector2(0, this.halfHeight)
    const bottom = new Vector2(0, -this.halfHeight)
    const topProjection = Vector2.dot(top, normal)
    const bottomProjection = Vector2.dot(bottom, normal)

    if (topProjection >= bottomProjection) {
      return [
        Vector2.add(top, Vector2.multiplyScalar(normal, this.radius)),
        Vector2.add(bottom, Vector2.multiplyScalar(normal, -this.radius))
      ]
    }

    return [
      Vector2.add(bottom, Vector2.multiplyScalar(normal, this.radius)),
      Vector2.add(top, Vector2.multiplyScalar(normal, -this.radius))
    ]
  }

  getSupportPoint2d(direction: Vector2): Vector2 {
    const axis = direction.magnitudeSquared() === 0
      ? Vector2.X.clone()
      : direction.clone().normalize()
    const center = axis.y >= 0
      ? new Vector2(0, this.halfHeight)
      : new Vector2(0, -this.halfHeight)

    return Vector2.multiplyScalar(axis, this.radius).add(center)
  }

  getFeature2d(direction: Vector2): Feature {
    if (Math.abs(direction.x) >= Math.abs(direction.y)) {
      const side = Math.sign(direction.x) || 1

      return {
        type: 'edge',
        v1: new Vector2(side * this.radius, -this.halfHeight),
        v2: new Vector2(side * this.radius, this.halfHeight),
        normal: new Vector2(side, 0)
      }
    }

    const axis = direction.magnitudeSquared() === 0
      ? Vector2.Y.clone()
      : direction.clone().normalize()
    const center = axis.y >= 0
      ? new Vector2(0, this.halfHeight)
      : new Vector2(0, -this.halfHeight)

    return {
      type: 'point',
      point: Vector2.multiplyScalar(axis, this.radius).add(center),
      normal: axis
    }
  }

  getPoints(resolution = 16): Vector2[] {
    const points: Vector2[] = []
    const steps = Math.max(4, Math.floor(resolution / 2))

    for (let i = 0; i <= steps; i++) {
      const angle = i * Math.PI / steps

      points.push(
        new Vector2(
          Math.cos(angle) * this.radius,
          Math.sin(angle) * this.radius + this.halfHeight
        )
      )
    }

    for (let i = 0; i <= steps; i++) {
      const angle = Math.PI + i * Math.PI / steps

      points.push(
        new Vector2(
          Math.cos(angle) * this.radius,
          Math.sin(angle) * this.radius - this.halfHeight
        )
      )
    }

    return points
  }

  aabb2d(): BoundingBox2D {
    return new BoundingBox2D(
      -this.radius,
      -(this.radius + this.halfHeight),
      this.radius,
      (this.radius + this.halfHeight)
    )
  }

  boundingCircle(): BoundingCircle {
    return new BoundingCircle(
      0,
      0,
      this.radius + this.halfHeight
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
    const start = new Vector2(0, this.halfHeight)
    const end = new Vector2(0, -this.halfHeight)
    const edge = Vector2.subtract(end, start)
    const lengthSq = Vector2.dot(edge, edge)

    if (lengthSq === 0) {
      return Vector2.distanceTo(point, start) - this.radius - tolerance
    }

    const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), edge) / lengthSq))
    const closest = Vector2.add(start, Vector2.multiplyScalar(edge, t))

    return Vector2.distanceTo(point, closest) - this.radius - tolerance
  }
}
