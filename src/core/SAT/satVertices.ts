import { Affine2, invert, Vector2 } from "hisabati"
import type { Contact2D } from "../contact"
import { SATStructure } from "./structs"
import { getContacts, projectVerticesToAxis } from "./utils"

/**
 * @param {Vector2[]} verticesA
 * @param {Vector2[]} verticesB
 * @param {Vector2[]} axes
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function SAT2d(
  verticesA: Vector2[],
  verticesB: Vector2[],
  axes: Vector2[],
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const position = new Vector2(
    transform.x,
    transform.y
  )
  const results = projectShapesToAxes(verticesA, verticesB, axes)

  if (!results) return undefined

  const contacts = getContacts(verticesA, verticesB, results, position)

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
 * @param {Vector2[]} verticesA
 * @param {Vector2[]} verticesB
 * @param {Vector2[]} axes
 */
export function projectShapesToAxes(
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
