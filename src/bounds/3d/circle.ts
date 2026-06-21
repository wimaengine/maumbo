import { Affine3, Quaternion, Vector3 } from 'hisabati'

/**
 * A circular 2d bound.
 */
export class BoundingSphere {
  radius = 0
  position

  constructor(x = 0, y = 0, z = 0, radius = 0) {
    this.radius = radius
    this.position = new Vector3(x, y, z)
  }

  translate(translation:Vector3) {
    return BoundingSphere.translate(this, translation, this)
  }

  rotate(center: Vector3, rotation: Quaternion) {
    return BoundingSphere.rotate(this, center, rotation, this)
  }

  transform(affine: Affine3) {
    return BoundingSphere.transform(this, affine, this)
  }

  copy(bound: BoundingSphere) {
    BoundingSphere.copy(bound, this)
  }

  static translate(bound: BoundingSphere, translation: Vector3, out = new BoundingSphere()) {
    out.position.x = bound.position.x + translation.x
    out.position.y = bound.position.y + translation.y
    out.position.z = bound.position.z + translation.z
    out.radius = bound.radius

    return out
  }

  static rotate(bound: BoundingSphere, center: Vector3, rotation: Quaternion, out = new BoundingSphere()) {
    const relative = Vector3.subtract(bound.position, center, new Vector3())

    Quaternion.transformVector3(rotation, relative)
    Vector3.add(relative, center, out.position)
    out.radius = bound.radius

    return out
  }

  static transform(bound: BoundingSphere, affine: Affine3, out = new BoundingSphere()) {
    Affine3.transform(affine, bound.position, out.position)
    out.radius = bound.radius

    return out
  }

  static copy(bound: BoundingSphere, out = new BoundingSphere()) {
    out.position.x = bound.position.x
    out.position.y = bound.position.y
    out.position.z = bound.position.z
    out.radius = bound.radius

    return out
  }
}
