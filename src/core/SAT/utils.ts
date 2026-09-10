import { Vector2 } from "hisabati"
import { SATProjection } from "./structs"

 
 /**
 * @param {Vector2[]} vertices
 * @param {Vector2} axis
 */
export function projectVerticesToAxis(vertices: Vector2[], axis: Vector2): SATProjection {
  const { length } = vertices
  const projection = new SATProjection(Infinity, -Infinity)

  for (let i = 0; i < length; i++) {
    const point = Vector2.dot(axis, vertices[i])

    if (point < projection.min) {
      projection.min = point
      projection.minIndex = i
    }
    if (point > projection.max) {
      projection.max = point
      projection.maxIndex = i
    }
  }

  return projection
}

