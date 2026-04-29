import { Affine2, invert, Vector2 } from "hisabati"
import { getContacts, projectCircleToAxis, projectVerticesToAxis } from "./utils"
import { SATStructure } from "./structs"
import type { Circle } from "../../shapes"
import type { Contact2D } from "../contact"

/**
 * @param {Circle} circle
 * @param {Vector2[]} vertices
 * @param {Vector2[]} axes
 * @param {Affine2} transform
 * @param {Affine2} [invTransform]
 */
export function sat2dCircle(
  circle: Circle,
  vertices: Vector2[],
  axes: Vector2[],
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const position = new Vector2(
    transform.x,
    transform.y
  )
  const results = projectCircleVerticesToAxes(circle, vertices, axes)

  if (!results) return undefined

  const verticesA = circle.getVertices(results.axis)

  const contacts = getContacts(verticesA, vertices, results, position)

  if (contacts) {
    contacts.map((contact) => {
      invTransform.transform(contact.pointB)
      contact.normalB = Affine2.transformWithoutTranslation(invTransform, contact.normalB)
      contact.tangentB = contact.tangentB
        ? Affine2.transformWithoutTranslation(invTransform, contact.tangentB)
        : Vector2.normal(contact.normalB)
      return contact
    })
  }

  return contacts
}

/**
 * @param {Circle} circle
 * @param {Vector2[]} vertices
 * @param {Vector2[]} axes
 */
function projectCircleVerticesToAxes(
  circle: Circle,
  vertices: Vector2[],
  axes: Vector2[]
): SATStructure | undefined {
  const axis = new Vector2()
  const point = new SATStructure()

  for (let i = 0; i < axes.length; i++) {
    Vector2.copy(axes[i], axis)
    const p1 = projectCircleToAxis(circle, axis)
    const p2 = projectVerticesToAxis(vertices, axis)
    const overlap = Math.min(p1.max - p2.min, p2.max - p1.min)

    if (overlap < 0) return undefined
    if (overlap < point.overlap) {
      Vector2.copy(axis, point.axis)
      point.overlap = overlap
    }
  }

  const length = invert(Vector2.magnitude(point.axis))

  point.overlap *= length
  Vector2.multiplyScalar(point.axis, length, point.axis)

  return point
}

