import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'
import { Vector2, TAU } from 'hisabati'
import type { Feature, SupportMapped2d } from '../../core/clipping.js'

export class Ellipse implements Boundable2D, SupportMapped2d {
  radiusX = 0
  radiusY = 0

  constructor(radiusX: number, radiusY: number) {
    this.radiusX = radiusX
    this.radiusY = radiusY
  }

  getVertices(axis: Vector2): [Vector2, Vector2] {
    const v1 = this.getSupportPoint2d(axis)
    const v2 = v1.clone().reverse()

    return [v1, v2]
  }

  getPoints(resolution = 32): Vector2[] {
    const vertices = []

    for (let i = 0; i < resolution; i++) {
      const angle = TAU * i / resolution

      vertices.push(
        new Vector2(
          Math.cos(angle) * this.radiusX,
          Math.sin(angle) * this.radiusY
        )
      )
    }

    return vertices
  }

  getSupportPoint2d(direction: Vector2): Vector2 {
    const axis = direction.magnitudeSquared() === 0
      ? Vector2.X.clone()
      : direction.clone()
    const x = this.radiusX * axis.x
    const y = this.radiusY * axis.y
    const scale = Math.sqrt(x * x + y * y)

    if (scale === 0) {
      return new Vector2(this.radiusX, 0)
    }

    return new Vector2(
      this.radiusX * this.radiusX * axis.x / scale,
      this.radiusY * this.radiusY * axis.y / scale
    )
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
      -this.radiusX,
      -this.radiusY,
      this.radiusX,
      this.radiusY
    )
  }

  boundingCircle(): BoundingCircle {
    return new BoundingCircle(
      0,
      0,
      Math.max(this.radiusX, this.radiusY)
    )
  }
}
