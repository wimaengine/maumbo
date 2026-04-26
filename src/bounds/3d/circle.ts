import { Vector3 } from 'hisabati'

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
    BoundingSphere.translate(this, translation, this)
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

  static copy(bound: BoundingSphere, out = new BoundingSphere()) {
    out.position.x = bound.position.x
    out.position.y = bound.position.y
    out.position.z = bound.position.z
    out.radius = bound.radius

    return out
  }
}
