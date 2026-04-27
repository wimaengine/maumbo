import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'
import { Shape2 } from './shape2.js'
import { Vector2, TAU } from 'hisabati'

export class Circle extends Shape2 implements Boundable2D {
  radius = 0

  constructor(radius: number) {
    super()
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

    aabb2d(): BoundingBox2D {
      return new BoundingBox2D(
        -this.radius
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
}
