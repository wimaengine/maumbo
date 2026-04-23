import { Shape2 } from './shape2.js'
import { Affine2, Vector2, fuzzyEqual } from 'hisabati'
import type { Feature } from '../../core/gjkEPA.js'
import { getPolygonFeature } from './utils.js'

export class ConvexPolygon extends Shape2 {
  points: Vector2[] = []
  normals: Vector2[] = []

  constructor(points: Vector2[], normals: Vector2[]) {
    super()
    this.points = points
    this.normals = normals
  }

  getPoints(): Vector2[] {
    return this.points
  }

  getSupportPoint(direction: Vector2, transform?: Affine2): Vector2 {
    let maxDot = -Infinity
    let support = transform
      ? transform.transform(this.points[0].clone())
      : this.points[0].clone()

    for (let i = 0; i < this.points.length; i++) {
      const point = transform
        ? transform.transform(this.points[i].clone())
        : this.points[i]
      const projection = Vector2.dot(point, direction)

      if (projection > maxDot) {
        maxDot = projection
        support = point
      }
    }

    return support.clone()
  }

  getFeature(direction: Vector2, transform?: Affine2): Feature {
    const vertices = transform
      ? this.points.map((point) => transform.transform(point.clone()))
      : this.points.map((point) => point.clone())

    return getPolygonFeature(vertices, direction)
  }

  static fromPoints(points: Vector2[]): ConvexPolygon {
    const normals = calcFaceNormals2D(points)

    return new ConvexPolygon(points, normals)
  }
}

/**
 * @param {Vector2[]} vertices
 * @param {undefined} [tolerance]
 * @returns {Vector2[]}
 */
function calcFaceNormals2D(vertices: Vector2[], tolerance?: number): Vector2[] {
  const axes: Vector2[] = []
  const { length } = vertices
  
  for (let i = 0, j = length - 1; i < length; j = i, i++) {
    const previous = vertices[j]
    const current = vertices[i]
    const axis = Vector2.subtract(previous, current)
    
    Vector2.normal(axis, axis)
    Vector2.normalize(axis, axis)

    if (!checkifEquals(axis, axes, tolerance)) axes.push(axis)
  }
  
  return axes
}

/**
 * @param {Vector2} axis
 * @param {Vector2[]} axes
 * @param {number} [tolerance]
 */
function checkifEquals(axis: Vector2, axes: Vector2[], tolerance?: number): boolean {
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
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {number} [tolerance]
 */
function absEqual(v1: Vector2, v2: Vector2, tolerance?: number): boolean {
  return (
    fuzzyEqual(v1.x, v2.x, tolerance) &&
    fuzzyEqual(v1.y, v2.y, tolerance)
  )
}
