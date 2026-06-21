import { BoundingBox2D, BoundingCircle, Segment2D, type BoundaryPrimitive2D, type Boundable2D } from '../../bounds/index.js'
import { Affine2, Vector2, TAU } from 'hisabati'
import type { Feature, SupportMapped2d } from '../../core/clipping.js'
import type { PointQuery2D } from '../../core/query.js'

export class Ellipse implements Boundable2D, SupportMapped2d, PointQuery2D {
  radiusX = 0
  radiusY = 0

  constructor(radiusX: number, radiusY: number) {
    this.radiusX = radiusX
    this.radiusY = radiusY
  }

  getVertices(axis: Vector2): [Vector2, Vector2] {
    const v1 = this.getSupportPoint2d(axis)
    const v2 = v1.clone().reverse()

    return [v1, v2]
  }

  getPoints(resolution = 32): Vector2[] {
    const vertices = []

    for (let i = 0; i < resolution; i++) {
      const angle = TAU * i / resolution

      vertices.push(
        new Vector2(
          Math.cos(angle) * this.radiusX,
          Math.sin(angle) * this.radiusY
        )
      )
    }

    return vertices
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
    const axis = direction.magnitudeSquared() === 0
      ? Vector2.X.clone()
      : direction.clone()
    const x = this.radiusX * axis.x
    const y = this.radiusY * axis.y
    const scale = Math.sqrt(x * x + y * y)

    if (scale === 0) {
      return new Vector2(this.radiusX, 0)
    }

    return new Vector2(
      this.radiusX * this.radiusX * axis.x / scale,
      this.radiusY * this.radiusY * axis.y / scale
    )
  }

  getFeature2d(direction: Vector2): Feature {
    const normal = direction.magnitudeSquared() === 0
      ? Vector2.X.clone()
      : direction.clone().normalize()

    return {
      type: 'point',
      point: this.getSupportPoint2d(direction),
      normal
    }
  }

  aabb2d(): BoundingBox2D {
    return new BoundingBox2D(
      -this.radiusX,
      -this.radiusY,
      this.radiusX,
      this.radiusY
    )
  }

  boundingCircle(): BoundingCircle {
    return new BoundingCircle(
      0,
      0,
      Math.max(this.radiusX, this.radiusY)
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
    const px = Math.abs(point.x)
    const py = Math.abs(point.y)

    if (this.radiusX === 0 && this.radiusY === 0) {
      return point.magnitude() - tolerance
    }

    if (this.radiusX === 0) {
      return distanceToEllipseAxis(point, new Vector2(0, -this.radiusY), new Vector2(0, this.radiusY)) - tolerance
    }

    if (this.radiusY === 0) {
      return distanceToEllipseAxis(point, new Vector2(-this.radiusX, 0), new Vector2(this.radiusX, 0)) - tolerance
    }

    if (px === 0 && py === 0) {
      return -Math.min(this.radiusX, this.radiusY) - tolerance
    }

    let angle = Math.atan2(py * this.radiusX, px * this.radiusY)

    for (let i = 0; i < 12; i++) {
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)
      const f = (this.radiusX * this.radiusX - this.radiusY * this.radiusY) * sin * cos
        - px * this.radiusX * sin
        + py * this.radiusY * cos
      const df = (this.radiusX * this.radiusX - this.radiusY * this.radiusY) * (cos * cos - sin * sin)
        - px * this.radiusX * cos
        - py * this.radiusY * sin

      if (df === 0) {
        break
      }

      const nextAngle = angle - f / df

      if (Math.abs(nextAngle - angle) <= 1e-10) {
        angle = nextAngle
        break
      }

      angle = nextAngle
    }

    const closest = new Vector2(
      this.radiusX * Math.cos(angle),
      this.radiusY * Math.sin(angle)
    )
    const distance = Vector2.distanceTo(new Vector2(px, py), closest)
    const normalized = (point.x * point.x) / (this.radiusX * this.radiusX) + (point.y * point.y) / (this.radiusY * this.radiusY)

    return (normalized <= 1 ? -distance : distance) - tolerance
  }
}

function distanceToEllipseAxis(point: Vector2, start: Vector2, end: Vector2): number {
  const edge = Vector2.subtract(end, start)
  const lengthSq = Vector2.dot(edge, edge)

  if (lengthSq === 0) {
    return Vector2.distanceTo(point, start)
  }

  const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, start), edge) / lengthSq))
  const closest = Vector2.add(start, Vector2.multiplyScalar(edge, t))

  return Vector2.distanceTo(point, closest)
}
