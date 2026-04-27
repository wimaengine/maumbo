import { Affine2, Vector2, fuzzyEqual } from 'hisabati'
import { getPolygonFeature, type Feature, type SupportMapped2d } from '../../core'
import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'

export class ConvexPolygon implements SupportMapped2d, Boundable2D {
  points: Vector2[] = []
  normals: Vector2[] = []

  constructor(points: Vector2[], normals: Vector2[]) {
    this.points = points
    this.normals = normals
  }

  getPoints(): Vector2[] {
    return this.points
  }

  getSupportPoint2d(direction: Vector2, transform?: Affine2): Vector2 {
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

  getFeature2d(direction: Vector2, transform?: Affine2): Feature {
    const vertices = transform
      ? this.points.map((point) => transform.transform(point.clone()))
      : this.points.map((point) => point.clone())

    return getPolygonFeature(vertices, direction)
  }

  aabb2d(): BoundingBox2D {
    const { points } = this
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }

    return new BoundingBox2D(
      minX,
      minY,
      maxX,
      maxY
    )
  }

  boundingCircle(): BoundingCircle {
    const { points } = this
    let maxDistSq = 0;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const d2 = p.magnitudeSquared()

      if (d2 > maxDistSq) maxDistSq = d2;
    }

    return new BoundingCircle(
      0,
      0,
      Math.sqrt(maxDistSq)
    )
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
