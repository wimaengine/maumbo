import { Vector2 } from 'hisabati'

export class Capsule {
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
