import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'
import { Affine2, Vector2, TAU } from 'hisabati'
import type { Feature, SupportMapped2d } from '../../core/clipping.js'
import type { PointQuery2D } from '../../core/query.js'

export class Circle implements Boundable2D, SupportMapped2d, PointQuery2D {
  radius = 0

  constructor(radius: number) {
    this.radius = radius
  }

  getVertices(axis: Vector2): [Vector2, Vector2] {
    const v1 = Vector2.setMagnitude(axis, this.radius)
    const v2 = Vector2.setMagnitude(axis, -this.radius)

    return [v1, v2]
  }

  getPoints(resolution = 32): Vector2[] {
    const vertices = []

    for (let i = 0; i < resolution; i++) {
      const angle = TAU * i / resolution

      vertices.push(
        new Vector2(
          Math.cos(angle),
          Math.sin(angle)
        )
          .multiplyScalar(this.radius)
      )
    }

    return vertices
  }

  getSupportPoint2d(direction: Vector2): Vector2 {
    const axis = direction.magnitudeSquared() === 0
      ? Vector2.X.clone()
      : direction.clone()

    return axis.setMagnitude(this.radius)
  }

  getFeature2d(direction: Vector2): Feature {
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
      -this.radius,
      -this.radius,
      this.radius,
      this.radius
    )
  }

  boundingCircle(): BoundingCircle {
    return new BoundingCircle(
      0,
      0,
      this.radius
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
    return point.magnitude() - this.radius - tolerance
  }
}
