import { Vector3 } from 'hisabati'

/**
 * A 2d axis aligned bounding box.
 */
export class BoundingBox3D {

  /**
   * The upper limit of the bounding box.
   *
   * @type {Vector3}
   */
  max

  /**
   * The lower limit of the bounding box.
   *
   * @type {Vector3}
   */
  min

  constructor(minX = 0, minY = 0, minZ = 0, maxX = 0, maxY = 0, maxZ = 0) {
    this.max = new Vector3(maxX, maxY, maxZ)
    this.min = new Vector3(minX, minY, minZ)
  }

  translate(translation:Vector3) {
    return BoundingBox3D.translate(this, translation, this)
  }

  /**
   * Deep copies a bounding box to a new one.
   *
   * @deprecated
   * @returns {BoundingBox3D}
   */
  clone() {
    return BoundingBox3D.copy(this)
  }

  /**
   * Deep copies another bounding box.
   */
  copy(bounds:BoundingBox3D) {
    BoundingBox3D.copy(bounds, this)
  }

  static copy(bound:BoundingBox3D, out = new BoundingBox3D()) {
    out.min.x = bound.min.x
    out.min.y = bound.min.y
    out.min.z = bound.min.z
    out.max.x = bound.max.x
    out.max.y = bound.max.y
    out.max.z = bound.max.z

    return out
  }

  /**
   */
  static translate(bound:BoundingBox3D, translate: Vector3, out = new BoundingBox3D()) {
    out.min.x = bound.min.x + translate.x
    out.min.y = bound.min.y + translate.y
    out.min.z = bound.min.z + translate.z
    out.max.x = bound.max.x + translate.x
    out.max.y = bound.max.y + translate.y
    out.max.z = bound.max.z + translate.z

    return out
  }

  /**
   * Combines two bounds to create a new one that covers the previous two.
   */
  static union(bound1:BoundingBox3D, bound2:BoundingBox3D, out = new BoundingBox3D()) {
    out.max.x = bound1.max.x > bound2.max.x ? bound1.max.x : bound2.max.x
    out.max.y = bound1.max.y > bound2.max.y ? bound1.max.y : bound2.max.y
    out.max.z = bound1.max.z > bound2.max.z ? bound1.max.z : bound2.max.z
    out.min.x = bound1.min.x < bound2.min.x ? bound1.min.x : bound2.min.x
    out.min.y = bound1.min.y < bound2.min.y ? bound1.min.y : bound2.min.y
    out.min.z = bound1.min.z < bound2.min.z ? bound1.min.z : bound2.min.z

    return out
  }
}
