import { Affine2, Vector2, fuzzyEqual } from 'hisabati'
import { getPolygonFeature, type Feature, type SupportMapped2d } from '../../core'
import { BoundingBox2D, BoundingCircle, Segment2D, type BoundaryPrimitive2D, type Boundable2D } from '../../bounds/index.js'
import type { PointQuery2D } from '../../core/query.js'

export class ConvexPolygon implements SupportMapped2d, Boundable2D, PointQuery2D {
  points: Vector2[] = []
  normals: Vector2[] = []

  constructor(points: Vector2[], normals: Vector2[]) {
    this.points = points
    this.normals = normals
  }

  getPoints(): Vector2[] {
    return this.points.map((p)=>p.clone())
  }

  getBoundary(): BoundaryPrimitive2D[] {
    const points = this.getPoints()
    const segments: BoundaryPrimitive2D[] = []

    if (points.length < 2) {
      return segments
    }

    for (let i = 0; i < points.length; i++) {
      const start = points[i]
      const end = points[(i + 1) % points.length]
      const edge = Vector2.subtract(end, start)

      if (edge.magnitudeSquared() <= 1e-16) {
        continue
      }

      segments.push(new Segment2D(start, end))
    }

    return segments
  }

  getSupportPoint2d(direction: Vector2): Vector2 {
    let maxDot = -Infinity
    let support = this.points[0].clone()

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i]
      const projection = Vector2.dot(point, direction)

      if (projection > maxDot) {
        maxDot = projection
        support = point
      }
    }

    return support.clone()
  }

  getFeature2d(direction: Vector2): Feature {
    return getPolygonFeature(this.points, direction)
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

  queryPointLocal(point: Vector2, tolerance = 0): boolean {
    return this.queryPointDistance(point, tolerance) <= 0
  }

  queryPoint(point: Vector2, transform: Affine2, tolerance = 0): boolean {
    return this.queryPointLocal(
      Affine2.invert(transform, new Affine2()).transform(point.clone()),
      tolerance
    )
  }

  queryPointDistance(point: Vector2, tolerance = 0): number {
    return signedDistanceToPolygon(point, this.points) - tolerance
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

function signedDistanceToPolygon(point: Vector2, vertices: Vector2[]): number {
  if (vertices.length === 0) {
    return Infinity
  }

  if (vertices.length === 1) {
    return Vector2.distanceTo(point, vertices[0])
  }

  let minDistance = Infinity
  let winding = 0

  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i]
    const next = vertices[(i + 1) % vertices.length]
    const edge = Vector2.subtract(next, current)
    const toPoint = Vector2.subtract(point, current)
    const cross = Vector2.cross(edge, toPoint)

    if (Math.abs(cross) > 1e-8) {
      const sign = Math.sign(cross)

      if (winding === 0) {
        winding = sign
      } else if (sign !== winding) {
        winding = Number.NaN
      }
    }

    minDistance = Math.min(minDistance, distanceToPolygonEdge(point, current, next))
  }

  return Number.isNaN(winding) ? minDistance : -minDistance
}

function distanceToPolygonEdge(point: Vector2, start: Vector2, end: Vector2): number {
  const edge = Vector2.subtract(end, start)
  const lengthSq = Vector2.dot(edge, edge)

  if (lengthSq === 0) {
    return Vector2.distanceTo(point, start)
  }

  const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), edge) / lengthSq))
  const closest = Vector2.add(start, Vector2.multiplyScalar(edge, t))

  return Vector2.distanceTo(point, closest)
}
