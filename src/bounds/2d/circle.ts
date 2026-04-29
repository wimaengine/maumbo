import { Affine2, Vector2 } from 'hisabati'

/**
 * A circular 2d bound.
 */
export class BoundingCircle {
  radius = 0
  position

  constructor(x = 0, y = 0, radius = 0) {
    this.radius = radius
    this.position = new Vector2(x, y)
  }

  translate(x:number, y:number) {
    BoundingCircle.translate(this, x, y, this)
  }

  transform(affine: Affine2) {
    BoundingCircle.transform(this, affine, this)
  }

  copy(bound: BoundingCircle) {
    BoundingCircle.copy(bound, this)
  }

  static translate(bound: BoundingCircle, x:number, y:number, out = new BoundingCircle()) {
    out.position.x = bound.position.x + x
    out.position.y = bound.position.y + y
    out.radius = bound.radius

    return out
  }

  static transform(bound: BoundingCircle, affine: Affine2, out = new BoundingCircle()) {
    Affine2.transform(affine, bound.position, out.position)
    out.radius = bound.radius * getMaxScale2d(affine)

    return out
  }

  static copy(bound: BoundingCircle, out = new BoundingCircle()) {
    out.position.x = bound.position.x
    out.position.y = bound.position.y
    out.radius = bound.radius

    return out
  }
}

function getMaxScale2d(affine: Affine2): number {
  const { a, b, c, d } = affine
  const trace = a * a + b * b + c * c + d * d
  const determinant = a * d - b * c
  const discriminant = Math.max(0, trace * trace - 4 * determinant * determinant)

  return Math.sqrt(0.5 * (trace + Math.sqrt(discriminant)))
}
