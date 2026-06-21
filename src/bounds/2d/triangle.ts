import { Affine2, Vector2 } from 'hisabati'
import type { Rotary } from 'hisabati'

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

  translate(translation: Vector2) {
    return TriangleBound2D.translate(this, translation, this)
  }

  rotate(center: Vector2, rotary: Rotary) {
    return TriangleBound2D.rotate(this, center, rotary, this)
  }

  transform(affine: Affine2) {
    return TriangleBound2D.transform(this, affine, this)
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
  static translate(bound:TriangleBound2D, translation: Vector2, out = new TriangleBound2D()) {
    out.c.x = bound.c.x + translation.x
    out.c.y = bound.c.y + translation.y
    out.b.x = bound.b.x + translation.x
    out.b.y = bound.b.y + translation.y
    out.a.x = bound.a.x + translation.x
    out.a.y = bound.a.y + translation.y

    return out
  }

  /**
   */
  static rotate(bound:TriangleBound2D, center: Vector2, rotary: Rotary, out = new TriangleBound2D()) {
    const c = Vector2.subtract(bound.c, center, new Vector2())
    const b = Vector2.subtract(bound.b, center, new Vector2())
    const a = Vector2.subtract(bound.a, center, new Vector2())

    Vector2.rotateFast(c, rotary.cos, rotary.sin, c)
    Vector2.rotateFast(b, rotary.cos, rotary.sin, b)
    Vector2.rotateFast(a, rotary.cos, rotary.sin, a)
    Vector2.add(c, center, out.c)
    Vector2.add(b, center, out.b)
    Vector2.add(a, center, out.a)

    return out
  }

  /**
   */
  static transform(bound:TriangleBound2D, affine: Affine2, out = new TriangleBound2D()) {
    Affine2.transform(affine, bound.c, out.c)
    Affine2.transform(affine, bound.b, out.b)
    Affine2.transform(affine, bound.a, out.a)

    return out
  }
}
