import { Vector3 } from 'hisabati'

/**
 * A 2d segment.
 */
export class TriangleBound3D {
  a
  b
  c

  constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
    this.a = a
    this.b = b
    this.c = c
  }

  translate(x:number, y:number, z = 0) {
    return TriangleBound3D.translate(this, x, y, z, this)
  }

  /**
   * Deep copies a bounding box to a new one.
   *
   * @deprecated
   * @returns {TriangleBound3D}
   */
  clone() {
    return TriangleBound3D.copy(this)
  }

  /**
   * Deep copies another bounding box.
   */
  copy(bounds:TriangleBound3D) {
    TriangleBound3D.copy(bounds, this)
  }

  static copy(bound:TriangleBound3D, out = new TriangleBound3D()) {
    out.c.x = bound.c.x
    out.c.y = bound.c.y
    out.c.z = bound.c.z
    out.b.x = bound.b.x
    out.b.y = bound.b.y
    out.b.z = bound.b.z
    out.a.x = bound.a.x
    out.a.y = bound.a.y
    out.a.z = bound.a.z

    return out
  }

  /**
   */
  static translate(bound:TriangleBound3D, x:number, y:number, z = 0, out = new TriangleBound3D()) {
    out.c.x = bound.c.x + x
    out.c.y = bound.c.y + y
    out.c.z = bound.c.z + z
    out.b.x = bound.b.x + x
    out.b.y = bound.b.y + y
    out.b.z = bound.b.z + z
    out.a.x = bound.a.x + x
    out.a.y = bound.a.y + y
    out.a.z = bound.a.z + z

    return out
  }
}
