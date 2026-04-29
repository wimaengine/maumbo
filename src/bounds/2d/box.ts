import { Affine2, Vector2 } from 'hisabati'

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

  translate(x:number, y:number) {
    return BoundingBox2D.translate(this, x, y, this)
  }

  transform(affine: Affine2){
    BoundingBox2D.transform(this,affine, this)
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
  static translate(bound:BoundingBox2D, x:number, y:number, out = new BoundingBox2D()) {
    out.min.x = bound.min.x + x
    out.min.y = bound.min.y + y
    out.max.x = bound.max.x + x
    out.max.y = bound.max.y + y

    return out
  }

  /**
   */
  static transform(bound:BoundingBox2D, transform:Affine2, out: BoundingBox2D) {
    Affine2.transform(transform,bound.min,out.min)
    Affine2.transform(transform,bound.max,out.max)

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
