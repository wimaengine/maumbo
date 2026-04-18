import { Affine2, Vector2, invert } from 'hisabati'
import { Capsule, Circle } from '../shapes'
import { Contact2D } from './contact.js'

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


      // todo: transform tangent too
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


      // todo: transform tangent too
      return contact
    })
  }

  return contacts
}

/**
 * @param {Capsule} capsule
 * @param {Vector2[]} vertices
 * @param {Vector2[]} axes
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function sat2dCapsule(
  capsule: Capsule,
  vertices: Vector2[],
  axes: Vector2[],
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const position = new Vector2(
    transform.x,
    transform.y
  )
  const results = projectCapsuleVerticesToAxes(capsule, vertices, axes)

  if (!results) return undefined

  const verticesA = capsule.getVertices(results.axis)
  const contacts = getContacts(verticesA, vertices, results, position)

  if (contacts) {
    contacts.map((contact) => {
      invTransform.transform(contact.pointB)
      contact.normalB = Affine2.transformWithoutTranslation(invTransform, contact.normalB)

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

  const axisReverse = axis.clone().reverse()
  const edgeA = findSupportEdge(verticesA, axis)
  const edgeB = findSupportEdge(verticesB, axisReverse)

  let incident: Edge
  let reference: Edge
  let flipped = false
  const edgeADir = Vector2.subtract(edgeA.v2, edgeA.v1)
  const edgeBDir = Vector2.subtract(edgeB.v2, edgeB.v1)

  if (
    Math.abs(Vector2.dot(edgeADir, axis)) <=
    Math.abs(Vector2.dot(edgeBDir, axis))
  ) {
    reference = edgeA
    incident = edgeB
  } else {
    reference = edgeB
    incident = edgeA
    flipped = true
  }

  const refDir = Vector2.subtract(reference.v2, reference.v1).normalize()
  const o1 = Vector2.dot(reference.v1, refDir)
  const clip1 = clip(incident.v1, incident.v2, refDir, o1)

  if (clip1.length < 2) return undefined

  const o2 = reference.dir.dot(reference.v2)
  const clip2 = clip(clip1[0], clip1[1], refDir.clone().reverse(), -o2)

  if (clip2.length < 2) return undefined

  const refNorm = Vector2.normal(refDir)

  const max = Vector2.dot(refNorm, reference.max)

  const p1 = refNorm.dot(clip2[0]) - max
  const p2 = refNorm.dot(clip2[1]) - max

  if (p1 < 0) {
    clip2.shift()

    if (p2 < 0) {
      clip2.pop()
    }
  } else {
    if (p2 < 0) {
      clip2.pop()
    }
  }

  return clip2.map((clip) => {
    const depth = refNorm.dot(clip) - max
    const distance = refNorm.clone().multiplyScalar(-depth)
    const tangent = Vector2.normal(refNorm)

    if (flipped) {
      return new Contact2D(
        clip,
        Vector2.copy(clip).add(distance),
        refNorm.clone(),
        refNorm.clone().reverse(),
        depth,
        tangent.clone(),
        tangent.clone()
      )
    }

    return new Contact2D(
      Vector2.copy(clip).add(distance),
      clip,
      refNorm.clone().reverse(),
      refNorm.clone(),
      depth,
      tangent.clone(),
      tangent.clone()
    )
  })
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
 * @param {Capsule} capsule
 * @param {Vector2[]} vertices
 * @param {Vector2[]} axes
 */
function projectCapsuleVerticesToAxes(
  capsule: Capsule,
  vertices: Vector2[],
  axes: Vector2[]
): SATStructure | undefined {
  const axis = new Vector2()
  const point = new SATStructure()

  for (let i = 0; i < axes.length; i++) {
    Vector2.copy(axes[i], axis)
    const p1 = projectCapsuleToAxis(capsule, axis)
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
 * @param {Capsule} capsule
 * @param {Vector2} axis
 */
function projectCapsuleToAxis(capsule: Capsule, axis: Vector2): SATProjection {
  const points = capsule.getVertices(axis)
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
function findSupportEdge(vertices: Vector2[], axis: Vector2): Edge {
  const { length } = vertices
  let maxProjection = -Infinity
  let maxIndex = 0

  for (let i = 0; i < length; i++) {
    const vertex = vertices[i]
    const projection = Vector2.dot(vertex, axis)

    if (projection > maxProjection) {
      maxProjection = projection
      maxIndex = i
    }
  }

  const current = vertices[maxIndex]
  const previous = vertices[(maxIndex - 1) === -1 ? length - 1 : maxIndex - 1]
  const next = vertices[(maxIndex + 1) % length]
  const left = Vector2.subtract(current, next).normalize()
  const right = Vector2.subtract(current, previous).normalize()

  if (right.dot(axis) <= left.dot(axis)) {
    return new Edge(current, previous, current, right)
  }

  return new Edge(current, current, next, left.reverse())
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Vector2} n
 * @param {number} o
 */
function clip(v1: Vector2, v2: Vector2, n: Vector2, o: number): Vector2[] {
  const cp: Vector2[] = []
  const d1 = n.dot(v1) - o
  const d2 = n.dot(v2) - o

  if (d1 >= 0.0) cp.push(v1)
  if (d2 >= 0.0) cp.push(v2)
  if (d1 * d2 < 0.0) {
    const e = Vector2.subtract(v2, v1)
    const u = d1 / (d1 - d2)

    e.multiplyScalar(u)
    e.add(v1)
    cp.push(e)
  }

  return cp
}

class Edge {
  max: Vector2
  v1: Vector2
  v2: Vector2
  dir: Vector2

  /**
   * @param {Vector2} max
   * @param {Vector2} v1
   * @param {Vector2} v2
   * @param {Vector2} dir
   */
  constructor(max: Vector2, v1: Vector2, v2: Vector2, dir: Vector2) {
    this.max = max
    this.v1 = v1
    this.v2 = v2
    this.dir = dir
  }
}
