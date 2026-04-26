import { Vector2 } from 'hisabati'

/**
 * A 2d segment.
 */
export class TriangleBound2D {
  a
  b
  c

  constructor(a = new Vector2(), b = new Vector2(), c = new Vector2()) {
    this.a = a
    this.b = b
    this.c = c
  }

  translate(x:number, y:number) {
    return TriangleBound2D.translate(this, x, y, this)
  }

  /**
   * Deep copies a bounding box to a new one.
   *
   * @deprecated
   * @returns {TriangleBound2D}
   */
  clone() {
    return TriangleBound2D.copy(this)
  }

  /**
   * Deep copies another bounding box.
   */
  copy(bounds:TriangleBound2D) {
    TriangleBound2D.copy(bounds, this)
  }

  static copy(bound:TriangleBound2D, out = new TriangleBound2D()) {
    out.c.x = bound.c.x
    out.c.y = bound.c.y
    out.b.x = bound.b.x
    out.b.y = bound.b.y
    out.a.x = bound.a.x
    out.a.y = bound.a.y

    return out
  }

  /**
   */
  static translate(bound:TriangleBound2D, x:number, y:number, out = new TriangleBound2D()) {
    out.c.x = bound.c.x + x
    out.c.y = bound.c.y + y
    out.b.x = bound.b.x + x
    out.b.y = bound.b.y + y
    out.a.x = bound.a.x + x
    out.a.y = bound.a.y + y

    return out
  }
}
