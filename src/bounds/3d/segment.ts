import { Vector3 } from 'hisabati'

/**
 * A 2d segment.
 */
export class Segment3D {

  /**
   * The start of the segment.
   *
   * @type {Vector3}
   */
  start

  /**
   * The end of the segment.
   *
   * @type {Vector3}
   */
  end

  constructor(minX = 0, minY = 0, minZ = 0, maxX = 0, maxY = 0, maxZ = 0) {
    this.start = new Vector3(minX, minY, minZ)
    this.end = new Vector3(maxX, maxY, maxZ)
  }

  translate(translation: Vector3) {
    return Segment3D.translate(this, translation, this)
  }

  /**
   * Deep copies a bounding box to a new one.
   *
   * @deprecated
   * @returns {Segment3D}
   */
  clone() {
    return Segment3D.copy(this)
  }

  /**
   * Deep copies another bounding box.
   */
  copy(bounds:Segment3D) {
    Segment3D.copy(bounds, this)
  }

  static copy(bound:Segment3D, out = new Segment3D()) {
    out.end.x = bound.end.x
    out.end.y = bound.end.y
    out.end.z = bound.end.z
    out.start.x = bound.start.x
    out.start.y = bound.start.y
    out.start.z = bound.start.z

    return out
  }

  /**
   */
  static translate(bound:Segment3D, translation:Vector3, out = new Segment3D()) {
    out.end.x = bound.end.x + translation.x
    out.end.y = bound.end.y + translation.y
    out.end.z = bound.end.z + translation.z
    out.start.x = bound.start.x + translation.x
    out.start.y = bound.start.y + translation.y
    out.start.z = bound.start.z + translation.z

    return out
  }
}
