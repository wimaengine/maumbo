import { Vector2, type Affine2 } from "hisabati"
import type { SupportMapped2d } from "../clipping"
import type { SupportPoint } from "./structs"
import { perpendicularToward, tripleProduct } from "../utils"

const GJK_MAX_ITERATIONS = 24

export function GJK2d(
  shapeA: SupportMapped2d,
  shapeB: SupportMapped2d,
  transform: Affine2,
  position: Vector2
): SupportPoint<Vector2>[] | undefined {
  let direction = position.magnitudeSquared() === 0 ? Vector2.X.clone() : position.clone()
  const simplex = [support(shapeA, shapeB, transform, direction)]

  direction = simplex[0].point.clone().reverse()

  for (let i = 0; i < GJK_MAX_ITERATIONS; i++) {
    if (direction.magnitudeSquared() === 0) {
      direction = Vector2.X.clone()
    }

    const point = support(shapeA, shapeB, transform, direction)

    if (Vector2.dot(point.point, direction) < 0) {
      return undefined
    }

    simplex.unshift(point)

    if (handleSimplex(simplex, direction)) {
      return simplex
    }
  }

  return simplex.length >= 3 ? simplex : undefined
}

function handleSimplex(simplex: SupportPoint<Vector2>[], direction: Vector2): boolean {
  const a = simplex[0]
  const ao = a.point.clone().reverse()

  if (simplex.length === 2) {
    const b = simplex[1]
    const ab = Vector2.subtract(b.point, a.point)
    let next = tripleProduct(ab, ao, ab)

    if (next.magnitudeSquared() === 0) {
      next = perpendicularToward(ab, ao)
    }

    direction.set(next.x, next.y)
    return false
  }

  const b = simplex[1]
  const c = simplex[2]
  const ab = Vector2.subtract(b.point, a.point)
  const ac = Vector2.subtract(c.point, a.point)
  let abPerp = tripleProduct(ac, ab, ab)

  if (abPerp.magnitudeSquared() === 0) {
    abPerp = perpendicularToward(ab, ao)
  }

  if (Vector2.dot(abPerp, ao) > 0) {
    simplex.splice(2, 1)
    direction.set(abPerp.x, abPerp.y)
    return false
  }

  let acPerp = tripleProduct(ab, ac, ac)

  if (acPerp.magnitudeSquared() === 0) {
    acPerp = perpendicularToward(ac, ao)
  }

  if (Vector2.dot(acPerp, ao) > 0) {
    simplex.splice(1, 1)
    direction.set(acPerp.x, acPerp.y)
    return false
  }

  return true
}

function support(
  shapeA: SupportMapped2d,
  shapeB: SupportMapped2d,
  transform: Affine2,
  direction: Vector2
): SupportPoint<Vector2> {
  const pointA = shapeA.getSupportPoint2d(direction)
  const pointB = shapeB.getSupportPoint2d(direction.clone().reverse(), transform)

  return {
    point: Vector2.subtract(pointA, pointB),
    pointA,
    pointB
  }
}