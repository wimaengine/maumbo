import { Affine2, Vector2 } from 'hisabati'
import { Contact2D } from './contact.js'

export type SupportPoint<T> = {
  point: T
  pointA: T
  pointB: T
}

export type Feature =
  | {
      type: 'point'
      point: Vector2
      normal: Vector2
    }
  | {
      type: 'edge'
      v1: Vector2
      v2: Vector2
      normal: Vector2
    }

export interface SupportMapped2d {
  getSupportPoint2d(direction: Vector2, transform?: Affine2): Vector2
  getFeature2d(direction: Vector2, transform?: Affine2): Feature
}

type EPAResult<T> = {
  depth: number
  normal: T
}

const GJK_MAX_ITERATIONS = 24
const EPA_MAX_ITERATIONS = 32
const EPA_TOLERANCE = 1e-6
const CONTACT_TOLERANCE = 1e-6

/**
 * Generic convex support-mapped contact manifold helper.
 */
export function GJKandEPA2d(
  shapeA: SupportMapped2d,
  shapeB: SupportMapped2d,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const simplex = GJK2d(shapeA, shapeB, transform, new Vector2(transform.x, transform.y))

  if (!simplex) {
    return undefined
  }

  const epa = EPA2d(simplex, shapeA, shapeB, transform, new Vector2(transform.x, transform.y))

  if (!epa) {
    return undefined
  }

  let contacts = buildContactsFromFeatures(
    shapeA.getFeature2d(epa.normal),
    shapeB.getFeature2d(epa.normal.clone().reverse(), transform),
    epa.normal,
    epa.depth
  )

  if (!contacts.length) {
    contacts = buildPointPointContact(
      shapeA.getSupportPoint2d(epa.normal),
      shapeB.getSupportPoint2d(epa.normal.clone().reverse(), transform),
      epa.normal,
      epa.depth
    )
  }

  contacts.forEach((contact) => {
    invTransform.transform(contact.pointB)
    contact.normalB = Affine2.transformWithoutTranslation(invTransform, contact.normalB)
    contact.tangentB = Affine2.transformWithoutTranslation(invTransform, contact.tangentB)
  })

  return contacts
}

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

function buildContactsFromFeatures(
  featureA: Feature,
  featureB: Feature,
  normal: Vector2,
  depth: number
): Contact2D[] {
  if (featureA.type === 'point' && featureB.type === 'edge') {
    return buildPointEdgeContacts(featureA.point, featureB, 'B')
  }

  if (featureA.type === 'edge' && featureB.type === 'edge') {
    const dirA = Vector2.subtract(featureA.v2, featureA.v1)
    const dirB = Vector2.subtract(featureB.v2, featureB.v1)

    if (Math.abs(Vector2.dot(dirA, normal)) <= Math.abs(Vector2.dot(dirB, normal))) {
      return buildEdgeEdgeContacts(featureA, featureB, 'A')
    }

    return buildEdgeEdgeContacts(featureB, featureA, 'B')
  }

  if (featureA.type === 'edge') {
    return buildPointEdgeContacts(getPointAlongNormal(depth, featureB, normal), featureA, 'A')
  }

  return buildPointPointContact(featureA.point, featureB.type === 'point' ? featureB.point : projectPointToFeature(featureA.point, featureB), normal, depth)
}

function buildEdgeEdgeContacts(reference: Extract<Feature, { type: 'edge' }>, incident: Extract<Feature, { type: 'edge' }>, referenceShape: 'A' | 'B'): Contact2D[] {
  const refDir = Vector2.subtract(reference.v2, reference.v1).normalize()
  const o1 = Vector2.dot(reference.v1, refDir)
  const clip1 = clipSegment(incident.v1, incident.v2, refDir, o1)

  if (clip1.length < 2) {
    return []
  }

  const o2 = Vector2.dot(reference.v2, refDir)
  const clip2 = clipSegment(clip1[0], clip1[1], refDir.clone().reverse(), -o2)

  if (clip2.length < 2) {
    return []
  }

  const contacts: Contact2D[] = []

  for (let i = 0; i < clip2.length; i++) {
    const incidentPoint = clip2[i]
    const separation = Vector2.dot(reference.normal, Vector2.subtract(incidentPoint, reference.v1))
    const penetration = -separation

    if (penetration < -CONTACT_TOLERANCE) {
      continue
    }

    const referencePoint = incidentPoint.clone().add(reference.normal.clone().multiplyScalar(penetration))

    contacts.push(createContact(referenceShape, reference.normal, referencePoint, incidentPoint, Math.max(penetration, 0)))
  }

  return dedupeContacts(contacts)
}

function buildPointEdgeContacts(
  point: Vector2,
  reference: Extract<Feature, { type: 'edge' }>,
  referenceShape: 'A' | 'B'
): Contact2D[] {
  const referencePoint = closestPointOnSegment(point, reference.v1, reference.v2)
  const separation = Vector2.dot(reference.normal, Vector2.subtract(point, referencePoint))
  const penetration = -separation

  if (penetration < -CONTACT_TOLERANCE) {
    return []
  }

  return [
    createContact(referenceShape, reference.normal, referencePoint, point, Math.max(penetration, 0))
  ]
}

function buildPointPointContact(pointA: Vector2, pointB: Vector2, normal: Vector2, depth: number): Contact2D[] {
  const normalA = normal.magnitudeSquared() === 0 ? Vector2.X.clone() : normal.clone().normalize()
  const normalB = normalA.clone().reverse()
  const tangentA = Vector2.normal(normalA)
  const tangentB = Vector2.normal(normalB)

  return [
    new Contact2D(
      pointA.clone(),
      pointB.clone(),
      normalA,
      normalB,
      Math.max(depth, 0),
      tangentA,
      tangentB
    )
  ]
}

function createContact(
  referenceShape: 'A' | 'B',
  referenceNormal: Vector2,
  referencePoint: Vector2,
  incidentPoint: Vector2,
  depth: number
): Contact2D {
  const tangent = Vector2.normal(referenceNormal)

  if (referenceShape === 'A') {
    return new Contact2D(
      referencePoint.clone(),
      incidentPoint.clone(),
      referenceNormal.clone(),
      referenceNormal.clone().reverse(),
      depth,
      tangent.clone(),
      tangent.clone()
    )
  }

  return new Contact2D(
    incidentPoint.clone(),
    referencePoint.clone(),
    referenceNormal.clone().reverse(),
    referenceNormal.clone(),
    depth,
    tangent.clone(),
    tangent.clone()
  )
}

function clipSegment(v1: Vector2, v2: Vector2, normal: Vector2, offset: number): Vector2[] {
  const points: Vector2[] = []
  const d1 = Vector2.dot(normal, v1) - offset
  const d2 = Vector2.dot(normal, v2) - offset

  if (d1 >= -CONTACT_TOLERANCE) {
    points.push(v1.clone())
  }

  if (d2 >= -CONTACT_TOLERANCE) {
    points.push(v2.clone())
  }

  if (d1 * d2 < 0) {
    const edge = Vector2.subtract(v2, v1)
    const t = d1 / (d1 - d2)
    points.push(edge.multiplyScalar(t).add(v1))
  }

  return points
}

function closestPointOnSegment(point: Vector2, a: Vector2, b: Vector2): Vector2 {
  const ab = Vector2.subtract(b, a)
  const lengthSq = ab.magnitudeSquared()

  if (lengthSq === 0) {
    return a.clone()
  }

  const t = Math.max(0, Math.min(1, Vector2.dot(Vector2.subtract(point, a), ab) / lengthSq))

  return Vector2.multiplyScalar(ab, t).add(a)
}

function projectPointToFeature(point: Vector2, feature: Feature): Vector2 {
  if (feature.type === 'point') {
    return feature.point.clone()
  }

  return closestPointOnSegment(point, feature.v1, feature.v2)
}

function getPointAlongNormal(depth: number, feature: Feature, normal: Vector2): Vector2 {
  if (feature.type === 'point') {
    return feature.point.clone()
  }

  return closestPointOnSegment(normal.clone().multiplyScalar(depth), feature.v1, feature.v2)
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

function tripleProduct(a: Vector2, b: Vector2, c: Vector2): Vector2 {
  const ac = Vector2.dot(a, c)
  const bc = Vector2.dot(b, c)

  return Vector2.subtract(
    Vector2.multiplyScalar(b, ac),
    Vector2.multiplyScalar(a, bc)
  )
}

function perpendicularToward(edge: Vector2, toward: Vector2): Vector2 {
  const normal = new Vector2(-edge.y, edge.x)

  if (Vector2.dot(normal, toward) < 0) {
    normal.reverse()
  }

  return normal
}

function dedupeContacts(contacts: Contact2D[]): Contact2D[] {
  return contacts.filter((contact, index) => {
    return !contacts.slice(0, index).some((other) => {
      return (
        Vector2.distanceToSquared(contact.pointA, other.pointA) <= CONTACT_TOLERANCE * CONTACT_TOLERANCE &&
        Vector2.distanceToSquared(contact.pointB, other.pointB) <= CONTACT_TOLERANCE * CONTACT_TOLERANCE
      )
    })
  })
}
