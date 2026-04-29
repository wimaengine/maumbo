import { Affine3, Vector3 } from 'hisabati'

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

  transform(affine: Affine3) {
    BoundingSphere.transform(this, affine, this)
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

  static transform(bound: BoundingSphere, affine: Affine3, out = new BoundingSphere()) {
    Affine3.transform(affine, bound.position, out.position)
    out.radius = bound.radius * getMaxScale3d(affine)

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

function getMaxScale3d(affine: Affine3): number {
  const { a, b, c, d, e, f, g, h, i } = affine
  const m11 = a * a + b * b + c * c
  const m12 = a * d + b * e + c * f
  const m13 = a * g + b * h + c * i
  const m22 = d * d + e * e + f * f
  const m23 = d * g + e * h + f * i
  const m33 = g * g + h * h + i * i
  const p1 = m12 * m12 + m13 * m13 + m23 * m23

  if (p1 === 0) {
    return Math.sqrt(Math.max(m11, m22, m33))
  }

  const trace = m11 + m22 + m33
  const q = trace / 3
  const centered11 = m11 - q
  const centered22 = m22 - q
  const centered33 = m33 - q
  const p2 = centered11 * centered11
    + centered22 * centered22
    + centered33 * centered33
    + 2 * p1
  const p = Math.sqrt(p2 / 6)

  if (p === 0) {
    return Math.sqrt(Math.max(m11, m22, m33))
  }

  const b11 = centered11 / p
  const b12 = m12 / p
  const b13 = m13 / p
  const b22 = centered22 / p
  const b23 = m23 / p
  const b33 = centered33 / p
  const determinant = b11 * (b22 * b33 - b23 * b23)
    - b12 * (b12 * b33 - b23 * b13)
    + b13 * (b12 * b23 - b22 * b13)
  const r = determinant / 2
  const phi = r <= -1
    ? Math.PI / 3
    : r >= 1
      ? 0
      : Math.acos(r) / 3
  const largestEigenvalue = q + 2 * p * Math.cos(phi)

  return Math.sqrt(Math.max(largestEigenvalue, 0))
}
