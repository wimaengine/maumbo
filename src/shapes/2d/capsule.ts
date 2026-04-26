import { Affine2, Vector2 } from 'hisabati'
import type { Feature, SupportMapped2d } from '../../core'

export class Capsule implements SupportMapped2d {
  radius = 0
  halfHeight = 0

  constructor(radius: number, halfHeight: number) {
    this.radius = radius
    this.halfHeight = halfHeight
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

  getSupportPoint2d(direction: Vector2, _transform?: Affine2): Vector2 {
    const axis = direction.magnitudeSquared() === 0
      ? Vector2.X.clone()
      : direction.clone().normalize()
    const center = axis.y >= 0
      ? new Vector2(0, this.halfHeight)
      : new Vector2(0, -this.halfHeight)

    return Vector2.multiplyScalar(axis, this.radius).add(center)
  }

  getFeature2d(direction: Vector2, _transform?: Affine2): Feature {
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
}
