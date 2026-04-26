import { Vector2 } from 'hisabati'

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

  copy(bound: BoundingCircle) {
    BoundingCircle.copy(bound, this)
  }

  static translate(bound: BoundingCircle, x:number, y:number, out = new BoundingCircle()) {
    out.position.x = bound.position.x + x
    out.position.y = bound.position.y + y
    out.radius = bound.radius

    return out
  }

  static copy(bound: BoundingCircle, out = new BoundingCircle()) {
    out.position.x = bound.position.x
    out.position.y = bound.position.y
    out.radius = bound.radius

    return out
  }
}
