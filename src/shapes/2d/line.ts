import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'
import { Shape2 } from './shape2.js'

export class Line2 extends Shape2 implements Boundable2D {
  halfLength = 0

  constructor(halfLength: number) {
    super()
    this.halfLength = halfLength
  }

  aabb2d(): BoundingBox2D {
    return new BoundingBox2D(
      -this.halfLength,
      -this.halfLength,
      this.halfLength,
      this.halfLength
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
