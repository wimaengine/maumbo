import { Affine2, Vector2 } from 'hisabati'
import type { Rotary } from 'hisabati'

/**
 * A 2d segment.
 */
export class Segment2D {

  /**
   * The start of the segment.
   *
   * @type {Vector2}
   */
  start

  /**
   * The end of the segment.
   *
   * @type {Vector2}
   */
  end

  constructor(start: Vector2 = new Vector2(), end: Vector2 = new Vector2()) {
    this.start = start
    this.end = end
  }

  translate(translation: Vector2) {
    return Segment2D.translate(this, translation, this)
  }

  rotate(center: Vector2, rotary: Rotary) {
    return Segment2D.rotate(this, center, rotary, this)
  }

  transform(affine: Affine2) {
    return Segment2D.transform(this, affine, this)
  }

  /**
   * Deep copies a bounding box to a new one.
   *
   * @deprecated
   * @returns {Segment2D}
   */
  clone() {
    return Segment2D.copy(this)
  }

  /**
   * Deep copies another bounding box.
   */
  copy(bounds:Segment2D) {
    Segment2D.copy(bounds, this)
  }

  static copy(bound:Segment2D, out = new Segment2D()) {
    out.end.x = bound.end.x
    out.end.y = bound.end.y
    out.start.x = bound.start.x
    out.start.y = bound.start.y

    return out
  }

  /**
   */
  static translate(bound:Segment2D, translation: Vector2, out = new Segment2D()) {
    out.end.x = bound.end.x + translation.x
    out.end.y = bound.end.y + translation.y
    out.start.x = bound.start.x + translation.x
    out.start.y = bound.start.y + translation.y

    return out
  }

  /**
   */
  static rotate(bound:Segment2D, center: Vector2, rotary: Rotary, out = new Segment2D()) {
    const end = Vector2.subtract(bound.end, center, new Vector2())
    const start = Vector2.subtract(bound.start, center, new Vector2())

    Vector2.rotateFast(end, rotary.cos, rotary.sin, end)
    Vector2.rotateFast(start, rotary.cos, rotary.sin, start)
    Vector2.add(end, center, out.end)
    Vector2.add(start, center, out.start)

    return out
  }

  /**
   */
  static transform(bound:Segment2D, affine: Affine2, out = new Segment2D()) {
    Affine2.transform(affine, bound.end, out.end)
    Affine2.transform(affine, bound.start, out.start)

    return out
  }
}
