import { Affine2, Vector2 } from 'hisabati'
import { Contact2D } from './contact.js'

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

export function clipSegment(v1: Vector2, v2: Vector2, normal: Vector2, offset: number, tolerance: number): Vector2[] {
  const points: Vector2[] = []
  const d1 = Vector2.dot(normal, v1) - offset
  const d2 = Vector2.dot(normal, v2) - offset

  if (d1 >= -tolerance) {
    points.push(v1.clone())
  }

  if (d2 >= -tolerance) {
    points.push(v2.clone())
  }

  if (d1 * d2 < 0) {
    const edge = Vector2.subtract(v2, v1)
    const t = d1 / (d1 - d2)
    points.push(edge.multiplyScalar(t).add(v1))
  }

  return points
}

export function buildContactsFromFeatures(
  featureA: Feature,
  featureB: Feature,
  normal: Vector2,
  depth: number,
  tolerance: number
): Contact2D[] {
  if (featureA.type === 'point' && featureB.type === 'edge') {
    return buildPointEdgeContacts(featureA.point, featureB, 'B', tolerance)
  }

  if (featureA.type === 'edge' && featureB.type === 'edge') {
    const dirA = Vector2.subtract(featureA.v2, featureA.v1)
    const dirB = Vector2.subtract(featureB.v2, featureB.v1)

    if (Math.abs(Vector2.dot(dirA, normal)) <= Math.abs(Vector2.dot(dirB, normal))) {
      return buildEdgeEdgeContacts(featureA, featureB, 'A', tolerance)
    }

    return buildEdgeEdgeContacts(featureB, featureA, 'B', tolerance)
  }

  if (featureA.type === 'edge') {
    return buildPointEdgeContacts(getPointAlongNormal(depth, featureB, normal), featureA, 'A', tolerance)
  }

  return buildPointPointContact(
    featureA.point,
    featureB.type === 'point' ? featureB.point : projectPointToFeature(featureA.point, featureB),
    normal,
    depth
  )
}

export function getPolygonFeature(vertices: Vector2[], direction: Vector2): Feature {
  const centroid = getPolygonCentroid(vertices)
  let best = createPolygonEdge(vertices, 0, centroid)
  let bestDot = Vector2.dot(best.normal, direction)

  for (let i = 1; i < vertices.length; i++) {
    const edge = createPolygonEdge(vertices, i, centroid)
    const projection = Vector2.dot(edge.normal, direction)

    if (projection > bestDot) {
      best = edge
      bestDot = projection
    }
  }

  return best
}

function buildEdgeEdgeContacts(
  reference: Extract<Feature, { type: 'edge' }>,
  incident: Extract<Feature, { type: 'edge' }>,
  referenceShape: 'A' | 'B',
  tolerance: number
): Contact2D[] {
  const refDir = Vector2.subtract(reference.v2, reference.v1).normalize()
  const o1 = Vector2.dot(reference.v1, refDir)
  const clip1 = clipSegment(incident.v1, incident.v2, refDir, o1, tolerance)

  if (clip1.length < 2) {
    return []
  }

  const o2 = Vector2.dot(reference.v2, refDir)
  const clip2 = clipSegment(clip1[0], clip1[1], refDir.clone().reverse(), -o2, tolerance)

  if (clip2.length < 2) {
    return []
  }

  const contacts: Contact2D[] = []

  for (let i = 0; i < clip2.length; i++) {
    const incidentPoint = clip2[i]
    const separation = Vector2.dot(reference.normal, Vector2.subtract(incidentPoint, reference.v1))
    const penetration = -separation

    if (penetration < -tolerance) {
      continue
    }

    const referencePoint = incidentPoint.clone().add(reference.normal.clone().multiplyScalar(penetration))

    contacts.push(createContact(referenceShape, reference.normal, referencePoint, incidentPoint, Math.max(penetration, 0)))
  }

  return dedupeContacts(contacts, tolerance)
}

// Modified Sutherland–Hodgman clipping algorithm for 2d contact generation
function buildPointEdgeContacts(
  point: Vector2,
  reference: Extract<Feature, { type: 'edge' }>,
  referenceShape: 'A' | 'B',
  tolerance: number
): Contact2D[] {
  const referencePoint = closestPointOnSegment(point, reference.v1, reference.v2)
  const separation = Vector2.dot(reference.normal, Vector2.subtract(point, referencePoint))
  const penetration = -separation

  if (penetration < -tolerance) {
    return []
  }

  return [
    createContact(referenceShape, reference.normal, referencePoint, point, Math.max(penetration, 0))
  ]
}

export function buildPointPointContact(pointA: Vector2, pointB: Vector2, normal: Vector2, depth: number): Contact2D[] {
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

function createPolygonEdge(
  vertices: Vector2[],
  index: number,
  centroid: Vector2
): Extract<Feature, { type: 'edge' }> {
  const v1 = vertices[index]
  const v2 = vertices[(index + 1) % vertices.length]
  const edge = Vector2.subtract(v2, v1)
  let normal = new Vector2(edge.y, -edge.x).normalize()
  const midpoint = Vector2.add(v1, v2).multiplyScalar(0.5)

  if (Vector2.dot(normal, Vector2.subtract(centroid, midpoint)) > 0) {
    normal = normal.reverse()
  }

  return {
    type: 'edge',
    v1: v1.clone(),
    v2: v2.clone(),
    normal
  }
}

function getPolygonCentroid(vertices: Vector2[]): Vector2 {
  const centroid = new Vector2()

  for (let i = 0; i < vertices.length; i++) {
    centroid.add(vertices[i])
  }

  return centroid.multiplyScalar(1 / vertices.length)
}

function dedupeContacts(contacts: Contact2D[], tolerance: number): Contact2D[] {
  return contacts.filter((contact, index) => {
    return !contacts.slice(0, index).some((other) => {
      return (
        Vector2.distanceToSquared(contact.pointA, other.pointA) <= tolerance * tolerance &&
        Vector2.distanceToSquared(contact.pointB, other.pointB) <= tolerance * tolerance
      )
    })
  })
}
