import { Affine2, Vector2 } from "hisabati"
import type { SupportPoint } from "../GJK"
import { type SupportMapped2d } from "../clipping"
import type { EPAResult } from "./structs"

const EPA_MAX_ITERATIONS = 32
const EPA_TOLERANCE = 1e-6

export function EPA2d(
  simplex: SupportPoint<Vector2>[],
  shapeA: SupportMapped2d,
  shapeB: SupportMapped2d,
  transform: Affine2,
  position: Vector2
): EPAResult<Vector2> | undefined {
  const polytope = ensureCounterClockwise(simplex.map(copySupportPoint))

  for (let i = 0; i < EPA_MAX_ITERATIONS; i++) {
    const edge = findClosestEdge(polytope)

    if (!edge) {
      return undefined
    }

    const alignedNormal = Vector2.dot(edge.normal, position) < 0
      ? edge.normal.clone().reverse()
      : edge.normal
    const point = support(shapeA, shapeB, transform, alignedNormal)
    const distance = Vector2.dot(point.point, alignedNormal)

    if (distance - edge.distance <= EPA_TOLERANCE) {
      return {
        normal: alignedNormal,
        depth: Math.max(distance, 0)
      }
    }

    polytope.splice(edge.index, 0, point)
  }

  const edge = findClosestEdge(polytope)

  if (!edge) {
    return undefined
  }

  const normal = Vector2.dot(edge.normal, position) < 0
    ? edge.normal.clone().reverse()
    : edge.normal

  return {
    normal,
    depth: Math.max(edge.distance, 0)
  }
}

function copySupportPoint(point: SupportPoint<Vector2>): SupportPoint<Vector2> {
  return {
    point: point.point.clone(),
    pointA: point.pointA.clone(),
    pointB: point.pointB.clone()
  }
}

function ensureCounterClockwise(simplex: SupportPoint<Vector2>[]): SupportPoint<Vector2>[] {
  if (simplex.length < 3) {
    return simplex
  }

  const a = simplex[0].point
  const b = simplex[1].point
  const c = simplex[2].point
  const area = Vector2.cross(Vector2.subtract(b, a), Vector2.subtract(c, a))

  if (area < 0) {
    const copy = simplex.slice()
    const temp = copy[1]
    copy[1] = copy[2]
    copy[2] = temp
    return copy
  }

  return simplex
}

function findClosestEdge(polytope: SupportPoint<Vector2>[]): { distance: number, index: number, normal: Vector2 } | undefined {
  let bestDistance = Infinity
  let bestIndex = -1
  let bestNormal: Vector2 | undefined

  for (let i = 0; i < polytope.length; i++) {
    const j = (i + 1) % polytope.length
    const a = polytope[i].point
    const b = polytope[j].point
    const edge = Vector2.subtract(b, a)
    let normal = new Vector2(edge.y, -edge.x)

    if (normal.magnitudeSquared() === 0) {
      continue
    }

    normal.normalize()

    if (Vector2.dot(normal, a) < 0) {
      normal = normal.reverse()
    }

    const distance = Vector2.dot(normal, a)

    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = j
      bestNormal = normal
    }
  }

  if (bestIndex === -1 || !bestNormal) {
    return undefined
  }

  return {
    distance: bestDistance,
    index: bestIndex,
    normal: bestNormal
  }
}

function support(
  shapeA: SupportMapped2d,
  shapeB: SupportMapped2d,
  transform: Affine2,
  direction: Vector2
): SupportPoint<Vector2> {
  const pointA = shapeA.getSupportPoint2d(direction)
  const pointB = Affine2.transform(
    transform,
    shapeB.getSupportPoint2d(
      Affine2.transformWithoutTranslation(transform, direction.clone().reverse())
    )
  )

  return {
    point: Vector2.subtract(pointA, pointB),
    pointA,
    pointB
  }
}
