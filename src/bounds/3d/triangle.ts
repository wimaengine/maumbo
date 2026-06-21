import { Affine3, Quaternion, Vector3 } from 'hisabati'

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

  translate(translation: Vector3) {
    return TriangleBound3D.translate(this, translation, this)
  }

  rotate(center: Vector3, rotation: Quaternion) {
    return TriangleBound3D.rotate(this, center, rotation, this)
  }

  transform(affine: Affine3) {
    return TriangleBound3D.transform(this, affine, this)
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
  static translate(bound:TriangleBound3D, translation: Vector3, out = new TriangleBound3D()) {
    out.c.x = bound.c.x + translation.x
    out.c.y = bound.c.y + translation.y
    out.c.z = bound.c.z + translation.z
    out.b.x = bound.b.x + translation.x
    out.b.y = bound.b.y + translation.y
    out.b.z = bound.b.z + translation.z
    out.a.x = bound.a.x + translation.x
    out.a.y = bound.a.y + translation.y
    out.a.z = bound.a.z + translation.z

    return out
  }

  /**
   */
  static rotate(bound:TriangleBound3D, center: Vector3, rotation: Quaternion, out = new TriangleBound3D()) {
    const c = Vector3.subtract(bound.c, center, new Vector3())
    const b = Vector3.subtract(bound.b, center, new Vector3())
    const a = Vector3.subtract(bound.a, center, new Vector3())

    Quaternion.transformVector3(rotation, c)
    Quaternion.transformVector3(rotation, b)
    Quaternion.transformVector3(rotation, a)
    Vector3.add(c, center, out.c)
    Vector3.add(b, center, out.b)
    Vector3.add(a, center, out.a)

    return out
  }

  /**
   */
  static transform(bound:TriangleBound3D, affine: Affine3, out = new TriangleBound3D()) {
    Affine3.transform(affine, bound.c, out.c)
    Affine3.transform(affine, bound.b, out.b)
    Affine3.transform(affine, bound.a, out.a)

    return out
  }
}
