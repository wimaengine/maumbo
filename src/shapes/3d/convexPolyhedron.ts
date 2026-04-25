import { Vector3, fuzzyEqual } from 'hisabati'

export class ConvexPolyhedron {
  points: Vector3[] = []
  normals: Vector3[] = []

  constructor(points: Vector3[], normals: Vector3[]) {
    this.points = points
    this.normals = normals
  }

  getPoints(): Vector3[] {
    return this.points
  }

  static fromPoints(points: Vector3[]): ConvexPolyhedron {
    const normals = calcFaceNormals3D(points)

    return new ConvexPolyhedron(points, normals)
  }
}

/**
 * @param {Vector3[]} vertices
 * @param {undefined} [tolerance]
 * @returns {Vector2[]}
 */
function calcFaceNormals3D(vertices: Vector3[], tolerance?: number): Vector3[] {
  const axes: Vector3[] = []
  const { length } = vertices

  if (length < 3) return axes

  const epsilon = tolerance ?? 1e-8
  const center = new Vector3()

  for (let i = 0; i < length; i++) center.add(vertices[i])
  center.divideScalar(length)

  for (let i = 0; i < length - 2; i++) {
    const a = vertices[i]

    for (let j = i + 1; j < length - 1; j++) {
      const ab = Vector3.subtract(vertices[j], a)

      for (let k = j + 1; k < length; k++) {
        const ac = Vector3.subtract(vertices[k], a)
        const axis = Vector3.cross(ab, ac)

        if (Vector3.magnitudeSquared(axis) <= epsilon * epsilon) continue

        let positive = false
        let negative = false

        for (let m = 0; m < length; m++) {
          if (m === i || m === j || m === k) continue

          const side = Vector3.dot(axis, Vector3.subtract(vertices[m], a))

          if (side > epsilon) positive = true
          else if (side < -epsilon) negative = true

          if (positive && negative) break
        }

        if (positive && negative) continue

        Vector3.normalize(axis, axis)

        if (Vector3.dot(axis, Vector3.subtract(center, a)) > 0) axis.reverse()

        if (!checkifEquals(axis, axes, tolerance)) axes.push(axis)
      }
    }
  }

  return axes
}

/**
 * @param {Vector2} axis
 * @param {Vector2[]} axes
 * @param {number} [tolerance]
 */
function checkifEquals(axis: Vector3, axes: Vector3[], tolerance?: number): boolean {
  const reverse = axis.clone().reverse()
  
  for (let i = 0; i < axes.length; i++) {
    const refAxis = axes[i]

    if (
      absEqual(axis, refAxis, tolerance) ||
      absEqual(reverse, refAxis, tolerance)
    ) return true
  }

  return false
}

/**
 * @param {Vector3} v1
 * @param {Vector3} v2
 * @param {number} [tolerance]
 */
function absEqual(v1: Vector3, v2: Vector3, tolerance?: number): boolean {
  return (
    fuzzyEqual(v1.x, v2.x, tolerance) &&
    fuzzyEqual(v1.y, v2.y, tolerance) &&
    fuzzyEqual(v1.z, v2.z, tolerance)
  )
}
