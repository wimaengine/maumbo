import { Vector2 } from "hisabati"
import type { Circle } from "../../shapes"
import { SATProjection, SATStructure } from "./structs"
import type { Contact2D } from "../contact"
import { buildContactsFromFeatures, getPolygonFeature } from "../clipping"

 /**
 * @param {Vector2[]} verticesA
 * @param {Vector2[]} verticesB
 * @param {SATStructure} results
 * @param {Vector2} position
 */
export function getContacts(
  verticesA: Vector2[],
  verticesB: Vector2[],
  results: SATStructure,
  position: Vector2
): Contact2D[] | undefined {
  const { axis } = results

  if (axis.dot(position) < 0) {
    axis.reverse()
  }

  const featureA = getPolygonFeature(verticesA, axis)
  const featureB = getPolygonFeature(verticesB, axis.clone().reverse())
  const contacts = buildContactsFromFeatures(featureA, featureB, axis, results.overlap, 0)

  return contacts.length ? contacts : undefined
}

 
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

/**
 * @param {Circle} circle
 * @param {Vector2} axis
 */
export function projectCircleToAxis(circle: Circle, axis: Vector2): SATProjection {
  const points = circle.getVertices(axis)
  const v1 = Vector2.dot(axis, points[0])
  const v2 = Vector2.dot(axis, points[1])

  if (v1 > v2) {
    return new SATProjection(v2, v1)
  }

  return new SATProjection(v1, v2)
}