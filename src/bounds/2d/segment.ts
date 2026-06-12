import { Vector2 } from 'hisabati'

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

  translate(x:number, y:number) {
    return Segment2D.translate(this, x, y, this)
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
  static translate(bound:Segment2D, x:number, y:number, out = new Segment2D()) {
    out.end.x = bound.end.x + x
    out.end.y = bound.end.y + y
    out.start.x = bound.start.x + x
    out.start.y = bound.start.y + y

    return out
  }
}
