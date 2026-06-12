import { Affine2, Vector2 } from 'hisabati'
import { getPolygonFeature, type Feature, type SupportMapped2d } from '../../core'
import { BoundingBox2D, BoundingCircle, type Boundable2D } from '../../bounds/index.js'
import type { PointQuery2D } from '../../core/query.js'

export class Triangle implements SupportMapped2d, Boundable2D, PointQuery2D {
  halfBase = 0
  halfHeight = 0
  baseRatio = 0

  constructor(halfBase: number, halfHeight: number, baseRatio = 0) {
    this.halfBase = halfBase
    this.halfHeight = halfHeight
    this.baseRatio = baseRatio
  }

  getPoints(): Vector2[] {
    const { baseRatio, halfBase, halfHeight } = this
    const positions = [
      new Vector2(-halfBase, -halfHeight),
      new Vector2(halfBase, -halfHeight),
      new Vector2(halfBase * baseRatio, halfHeight)
    ]

    return positions
  }

  getSupportPoint2d(direction: Vector2): Vector2 {
    const points = this.getPoints()
    let maxDot = -Infinity
    let support = points[0].clone()

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const projection = Vector2.dot(point, direction)

      if (projection > maxDot) {
        maxDot = projection
        support = point
      }
    }

    return support.clone()
  }

  getFeature2d(direction: Vector2): Feature {
    return getPolygonFeature(this.getPoints(), direction)
  }

  aabb2d(): BoundingBox2D {
    return new BoundingBox2D(
      -this.halfBase,
      -this.halfHeight,
      this.halfBase,
      this.halfHeight
    )
  }
  boundingCircle(): BoundingCircle {
    const {halfBase, halfHeight} = this
    return new BoundingCircle(
      0,
      0,
      Math.sqrt(halfBase * halfBase + halfHeight * halfHeight)
    )
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
    return signedDistanceToTriangle(point, this.getPoints()) - tolerance
  }
}

function signedDistanceToTriangle(point: Vector2, vertices: Vector2[]): number {
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

    minDistance = Math.min(minDistance, distanceToTriangleEdge(point, current, next))
  }

  return Number.isNaN(winding) ? minDistance : -minDistance
}

function distanceToTriangleEdge(point: Vector2, start: Vector2, end: Vector2): number {
  const edge = Vector2.subtract(end, start)
  const lengthSq = Vector2.dot(edge, edge)

  if (lengthSq === 0) {
    return Vector2.distanceTo(point, start)
  }

  const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), edge) / lengthSq))
  const closest = Vector2.add(start, Vector2.multiplyScalar(edge, t))

  return Vector2.distanceTo(point, closest)
}
