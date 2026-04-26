import { Affine2, Vector2, invert } from 'hisabati'
import { Circle } from '../shapes'
import { Contact2D } from './contact.js'
import { buildContactsFromFeatures, getPolygonFeature } from './clipping.js'

class SATProjection {
  min = Infinity
  max = -Infinity
  minIndex = 0
  maxIndex = 0

  constructor(min = Infinity, max = -Infinity) {
    this.min = min
    this.max = max
  }
}

class SATStructure {
  axis = new Vector2(0, 0)
  overlap = Infinity

  constructor(axis = new Vector2(0, 0), overlap = Infinity) {
    this.axis = axis
    this.overlap = overlap
  }
}

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
 * @param {Vector2[]} verticesA
 * @param {Vector2[]} verticesB
 * @param {Vector2[]} axes
 */
function projectShapesToAxes(
  verticesA: Vector2[],
  verticesB: Vector2[],
  axes: Vector2[]
): SATStructure | undefined {
  const axis = new Vector2()
  const point = new SATStructure()

  for (let i = 0; i < axes.length; i++) {
    Vector2.copy(axes[i], axis)
    const p1 = projectVerticesToAxis(verticesA, axis)
    const p2 = projectVerticesToAxis(verticesB, axis)
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

/**
 * @param {Vector2[]} vertices
 * @param {Vector2} axis
 */
function projectVerticesToAxis(vertices: Vector2[], axis: Vector2): SATProjection {
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
function projectCircleToAxis(circle: Circle, axis: Vector2): SATProjection {
  const points = circle.getVertices(axis)
  const v1 = Vector2.dot(axis, points[0])
  const v2 = Vector2.dot(axis, points[1])

  if (v1 > v2) {
    return new SATProjection(v2, v1)
  }

  return new SATProjection(v1, v2)
}

/**
 * @param {Vector2[]} vertices
 * @param {Vector2} axis
 */
