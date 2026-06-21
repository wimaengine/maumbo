import { Affine2, Vector2 } from 'hisabati'
import type { Rotary } from 'hisabati'

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

  translate(translation: Vector2) {
    return BoundingCircle.translate(this, translation, this)
  }

  rotate(center: Vector2, rotary: Rotary) {
    return BoundingCircle.rotate(this, center, rotary, this)
  }

  transform(affine: Affine2) {
    return BoundingCircle.transform(this, affine, this)
  }

  copy(bound: BoundingCircle) {
    BoundingCircle.copy(bound, this)
  }

  static translate(bound: BoundingCircle, translation: Vector2, out = new BoundingCircle()) {
    out.position.x = bound.position.x + translation.x
    out.position.y = bound.position.y + translation.y
    out.radius = bound.radius

    return out
  }

  static rotate(bound: BoundingCircle, center: Vector2, rotary: Rotary, out = new BoundingCircle()) {
    const relative = Vector2.subtract(bound.position, center, new Vector2())

    Vector2.rotateFast(relative, rotary.cos, rotary.sin, relative)
    Vector2.add(relative, center, out.position)
    out.radius = bound.radius

    return out
  }

  static transform(bound: BoundingCircle, affine: Affine2, out = new BoundingCircle()) {
    Affine2.transform(affine, bound.position, out.position)
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
