import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'

export class Line2 implements Boundable2D {
  halfLength = 0

  constructor(halfLength: number) {
    this.halfLength = halfLength
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
