import { invert, Vector2 } from "hisabati"
import { SATStructure } from "./structs"
import { projectVerticesToAxis } from "./utils"
import type { SupportMapped2d } from "../clipping"

export function sat2d(
  verticesA: Vector2[],
  verticesB: Vector2[],
  axes: Vector2[],
  earlyReturn = true
): SATStructure | undefined {
  const axis = new Vector2()
  const point = new SATStructure()

  for (let i = 0; i < axes.length; i++) {
    Vector2.copy(axes[i], axis)
    const p1 = projectVerticesToAxis(verticesA, axis)
    const p2 = projectVerticesToAxis(verticesB, axis)
    const overlap = Math.min(p1.max - p2.min, p2.max - p1.min)

    if ((overlap < 0) && earlyReturn) {
      return undefined
    }

    if (Math.abs(overlap) < Math.abs(point.overlap)) {
      Vector2.copy(axis, point.axis)
      point.overlap = overlap
    }
  }

  const length = invert(Vector2.magnitude(point.axis))

  point.overlap *= length
  Vector2.multiplyScalar(point.axis, length, point.axis)

  return point
}

/**
 * @param {SupportMapped2d} shape
 * @param {Vector2[]} vertices
 * @param {Vector2[]} axes
 * @param {boolean} [earlyReturn]
 */
export function sat2dSupportMap(
  shape: SupportMapped2d,
  vertices: Vector2[],
  axes: Vector2[],
  earlyReturn = true
): SATStructure | undefined {
  const axis = new Vector2()
  const point = new SATStructure()

  for (let i = 0; i < axes.length; i++) {
    Vector2.copy(axes[i], axis)
    const [minA, maxA] = shape.project(axis)
    const p2 = projectVerticesToAxis(vertices, axis)
    const overlap = Math.min(maxA - p2.min, p2.max - minA)

    if (overlap < 0) {
      if (earlyReturn) return undefined
    }

    if (Math.abs(overlap) < Math.abs(point.overlap)) {
      Vector2.copy(axis, point.axis)
      point.overlap = overlap
    }
  }

  const length = invert(Vector2.magnitude(point.axis))

  point.overlap *= length
  Vector2.multiplyScalar(point.axis, length, point.axis)

  return point
}
