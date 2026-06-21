import { Affine2, Vector2 } from 'hisabati'
import type { Rotary } from 'hisabati'

/**
 * A 2d axis aligned bounding box.
 */
export class BoundingBox2D {

  /**
   * The upper limit of the bounding box.
   *
   * @type {Vector2}
   */
  max

  /**
   * The lower limit of the bounding box.
   *
   * @type {Vector2}
   */
  min

  constructor(minX = 0, minY = 0, maxX = 0, maxY = 0) {
    this.max = new Vector2(maxX, maxY)
    this.min = new Vector2(minX, minY)
  }

  translate(translation: Vector2) {
    return BoundingBox2D.translate(this, translation, this)
  }

  rotate(center: Vector2, rotary: Rotary) {
    return BoundingBox2D.rotate(this, center, rotary, this)
  }

  transform(affine: Affine2){
    return BoundingBox2D.transform(this,affine, this)
  }

  /**
   * Deep copies a bounding box to a new one.
   *
   * @deprecated
   * @returns {BoundingBox2D}
   */
  clone() {
    return BoundingBox2D.copy(this)
  }

  /**
   * Deep copies another bounding box.
   */
  copy(bounds:BoundingBox2D) {
    BoundingBox2D.copy(bounds, this)
  }

  static copy(bound:BoundingBox2D, out = new BoundingBox2D()) {
    out.min.x = bound.min.x
    out.min.y = bound.min.y
    out.max.x = bound.max.x
    out.max.y = bound.max.y

    return out
  }

  /**
   */
  static translate(bound:BoundingBox2D, translation: Vector2, out = new BoundingBox2D()) {
    out.min.x = bound.min.x + translation.x
    out.min.y = bound.min.y + translation.y
    out.max.x = bound.max.x + translation.x
    out.max.y = bound.max.y + translation.y

    return out
  }

  /**
   */
  static rotate(bound:BoundingBox2D, center: Vector2, rotary: Rotary, out = new BoundingBox2D()) {
    const min = Vector2.subtract(bound.min, center, new Vector2())
    const maxXMinY = Vector2.subtract(new Vector2(bound.max.x, bound.min.y), center, new Vector2())
    const max = Vector2.subtract(bound.max, center, new Vector2())
    const minXMaxY = Vector2.subtract(new Vector2(bound.min.x, bound.max.y), center, new Vector2())

    Vector2.rotateFast(min, rotary.cos, rotary.sin, min)
    Vector2.rotateFast(maxXMinY, rotary.cos, rotary.sin, maxXMinY)
    Vector2.rotateFast(max, rotary.cos, rotary.sin, max)
    Vector2.rotateFast(minXMaxY, rotary.cos, rotary.sin, minXMaxY)
    Vector2.add(min, center, min)
    Vector2.add(maxXMinY, center, maxXMinY)
    Vector2.add(max, center, max)
    Vector2.add(minXMaxY, center, minXMaxY)

    let outMinX = min.x
    let outMinY = min.y
    let outMaxX = min.x
    let outMaxY = min.y

    outMinX = Math.min(outMinX, maxXMinY.x, max.x, minXMaxY.x)
    outMinY = Math.min(outMinY, maxXMinY.y, max.y, minXMaxY.y)
    outMaxX = Math.max(outMaxX, maxXMinY.x, max.x, minXMaxY.x)
    outMaxY = Math.max(outMaxY, maxXMinY.y, max.y, minXMaxY.y)

    out.min.x = outMinX
    out.min.y = outMinY
    out.max.x = outMaxX
    out.max.y = outMaxY

    return out
  }

  /**
   */
  static transform(bound:BoundingBox2D, transform:Affine2, out = new BoundingBox2D()) {
    const min = Affine2.transform(transform, bound.min.clone())
    const maxXMinY = Affine2.transform(transform, new Vector2(bound.max.x, bound.min.y))
    const max = Affine2.transform(transform, bound.max.clone())
    const minXMaxY = Affine2.transform(transform, new Vector2(bound.min.x, bound.max.y))

    let outMinX = min.x
    let outMinY = min.y
    let outMaxX = min.x
    let outMaxY = min.y

    outMinX = Math.min(outMinX, maxXMinY.x, max.x, minXMaxY.x)
    outMinY = Math.min(outMinY, maxXMinY.y, max.y, minXMaxY.y)
    outMaxX = Math.max(outMaxX, maxXMinY.x, max.x, minXMaxY.x)
    outMaxY = Math.max(outMaxY, maxXMinY.y, max.y, minXMaxY.y)

    out.min.x = outMinX
    out.min.y = outMinY
    out.max.x = outMaxX
    out.max.y = outMaxY

    return out
  }

  /**
   * Combines two bounds to create a new one that covers the previous two.
   */
  static union(bound1:BoundingBox2D, bound2:BoundingBox2D, out = new BoundingBox2D()) {
    out.max.x = bound1.max.x > bound2.max.x ? bound1.max.x : bound2.max.x
    out.max.y = bound1.max.y > bound2.max.y ? bound1.max.y : bound2.max.y
    out.min.x = bound1.min.x < bound2.min.x ? bound1.min.x : bound2.min.x
    out.min.y = bound1.min.y < bound2.min.y ? bound1.min.y : bound2.min.y
    return out
  }
}
