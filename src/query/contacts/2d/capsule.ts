import {
  Contact2D,
  sat2dCapsule,
  GJKandEPA
} from '../../../core'
import { Capsule, Circle, ConvexPolygon, Rectangle, Triangle } from '../../../shapes'
import { Vector2, clamp, Affine2 } from 'hisabati'
import {
  closestPointsSegmentSegment
} from '../../closestPoint'
import { getNearVertex } from './utils.js'

/**
 * @param {Capsule} capsuleA
 * @param {Capsule} capsuleB
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function capsuleContacts(
  capsuleA: Capsule,
  capsuleB: Capsule,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const a0 = new Vector2(0, capsuleA.halfHeight)
  const a1 = new Vector2(0, -capsuleA.halfHeight)
  const b0 = transform.transform(new Vector2(0, capsuleB.halfHeight))
  const b1 = transform.transform(new Vector2(0, -capsuleB.halfHeight))
  const radiusSum = capsuleA.radius + capsuleB.radius
  const { pA, pB } = closestPointsSegmentSegment(a0, a1, b0, b1)
  const delta = Vector2.subtract(pB, pA)
  const separation = delta.magnitude()
  const closest = [
    {
      pointA: pA,
      pointB: pB,
      distance: separation
    }
  ]
  const contacts = closest
    .map((point) => {
    const distance = radiusSum - point.distance

    if (distance < 0) {
      return undefined
    }

    const normalA = separation !== 0
      ? Vector2.divideScalar(delta, separation)
      : Vector2.Y.clone()
    const normalB = Affine2.transformWithoutTranslation(invTransform, normalA).reverse()
    const tangentA = Vector2.normal(normalA)
    const tangentB = Vector2.normal(normalB)
    const pointB = invTransform.transform(point.pointB)

    return new Contact2D(
      Vector2.multiplyScalar(normalA, capsuleA.radius).add(point.pointA),
      Vector2.multiplyScalar(normalB, capsuleB.radius).add(pointB),
      normalA,
      normalB,
      distance,
      tangentA,
      tangentB
    )
    })
    .filter((e): e is Contact2D => e !== undefined)

  if (!contacts.length) {
    return undefined
  }

  return contacts
}

/**
 * @param {Capsule} capsule
 * @param {Circle} circle
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function capsuleCircleContact(
  capsule: Capsule,
  circle: Circle,
  transform: Affine2,
  invTransform: Affine2
): Contact2D | undefined {
  const position = new Vector2(
    transform.x,
    transform.y
  )
  const lineStart = new Vector2(0, capsule.halfHeight)
  const lineEnd = new Vector2(0, -capsule.halfHeight)

  const radiusSum = circle.radius + capsule.radius
  const l1 = Vector2.subtract(lineEnd, lineStart)
  const l2 = Vector2.subtract(position, lineStart)
  const lenSq = l1.magnitudeSquared()
  const t = clamp(Vector2.dot(l1, l2) / lenSq, 0, 1)
  const closest = Vector2.multiplyScalar(l1, t).add(lineStart)
  const dist = Vector2.subtract(position, closest)
  const distSq = dist.magnitudeSquared()

  if (distSq > radiusSum * radiusSum) {
    return undefined
  }

  const distance = Math.sqrt(distSq)
  const penetration = radiusSum - distance

  const normalA = distance !== 0 ? Vector2.divideScalar(dist, distance) : Vector2.Y.clone()
  const normalB = Affine2.transformWithoutTranslation(invTransform, normalA).reverse()
  const tangentA = Vector2.normal(normalA)
  const tangentB = Vector2.normal(normalB)

  return new Contact2D(
    Vector2.multiplyScalar(normalA, capsule.radius).add(closest),
    Vector2.multiplyScalar(normalB, circle.radius),
    normalA,
    normalB,
    penetration,
    tangentA,
    tangentB
  )
}

/**
 * @param {Capsule} a   // body A
 * @param {Rectangle} b // body B (OBB)
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function capsuleRectangleContact(
  a: Capsule,
  b: Rectangle,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const points = b.getPoints().map((e: Vector2) => transform.transform(e.clone()))
  const contacts = GJKandEPA(
    (direction: Vector2) => createCapsuleSupportPoint(a, direction),
    (direction: Vector2) => a.getFeature(direction),
    (direction: Vector2) => createShapeSupportPoint(b.getSupportPoint(direction, transform)),
    (direction: Vector2) => b.getFeature(direction, transform),
    transform,
    invTransform
  )
  const fallbackContacts = sat2dCapsule(
    a,
    points,
    [
      getCapsuleFallbackAxis(points, transform),
      Vector2.normal(Vector2.subtract(points[0], points[1])).normalize(),
      Vector2.normal(Vector2.subtract(points[1], points[2])).normalize()
    ],
    transform,
    invTransform
  )

  if (!contacts) {
    return fallbackContacts
  }

  if (fallbackContacts && fallbackContacts.length > contacts.length) {
    return fallbackContacts
  }

  return contacts
}

/**
 * @param {Capsule} a    // body A
 * @param {Triangle} b  // body B
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function capsuleTriangleContact(
  a: Capsule,
  b: Triangle,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const points = b.getPoints().map((e: Vector2) => transform.transform(e.clone()))
  const contacts = GJKandEPA(
    (direction: Vector2) => createCapsuleSupportPoint(a, direction),
    (direction: Vector2) => a.getFeature(direction),
    (direction: Vector2) => createShapeSupportPoint(b.getSupportPoint(direction, transform)),
    (direction: Vector2) => b.getFeature(direction, transform),
    transform,
    invTransform
  )
  const fallbackContacts = sat2dCapsule(
    a,
    points,
    [
      getCapsuleFallbackAxis(points, transform),
      Vector2.normal(Vector2.subtract(points[0], points[1])).normalize(),
      Vector2.normal(Vector2.subtract(points[1], points[2])).normalize(),
      Vector2.normal(Vector2.subtract(points[2], points[0])).normalize()
    ],
    transform,
    invTransform
  )

  if (!contacts) {
    return fallbackContacts
  }

  if (fallbackContacts && fallbackContacts.length > contacts.length) {
    return fallbackContacts
  }

  return contacts
}

/**
 * @param {Capsule} a          // body A
 * @param {ConvexPolygon} b   // body B
 * @param {Affine2} transform     // B -> A
 * @param {Affine2} invTransform  // A -> B
 */
export function capsuleConvexPolygonContact(
  a: Capsule,
  b: ConvexPolygon,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const points = b.points.map((e: Vector2) => transform.transform(e.clone()))
  const contacts = GJKandEPA(
    (direction: Vector2) => createCapsuleSupportPoint(a, direction),
    (direction: Vector2) => a.getFeature(direction),
    (direction: Vector2) => createShapeSupportPoint(b.getSupportPoint(direction, transform)),
    (direction: Vector2) => b.getFeature(direction, transform),
    transform,
    invTransform
  )
  const fallbackContacts = sat2dCapsule(
    a,
    points,
    getCapsuleFallbackAxes(points, transform),
    transform,
    invTransform
  )

  if (!contacts) {
    return fallbackContacts
  }

  if (fallbackContacts && fallbackContacts.length > contacts.length) {
    return fallbackContacts
  }

  return contacts
}

function createCapsuleSupportPoint(capsule: Capsule, direction: Vector2) {
  const pointA = capsule.getSupportPoint(direction)

  return {
    point: pointA.clone(),
    pointA,
    pointB: new Vector2()
  }
}

function createShapeSupportPoint(pointB: Vector2) {
  return {
    point: pointB.clone(),
    pointA: new Vector2(),
    pointB
  }
}

function getCapsuleFallbackAxis(points: Vector2[], transform: Affine2): Vector2 {
  const nearestIndex = getNearVertex(Vector2.Zero, points)
  const axis = Vector2.copy(points[nearestIndex])

  if (axis.magnitudeSquared() === 0) {
    axis.set(transform.x, transform.y)
  }

  return axis.normalize()
}

function getCapsuleFallbackAxes(points: Vector2[], transform: Affine2): Vector2[] {
  const axes = [getCapsuleFallbackAxis(points, transform)]
  const unique: Vector2[] = []

  for (let i = 0; i < points.length; i++) {
    const current = points[i]
    const next = points[(i + 1) % points.length]
    const edge = Vector2.subtract(current, next)

    if (edge.magnitudeSquared() === 0) {
      continue
    }

    const normal = Vector2.normal(edge).normalize()
    const duplicate = unique.some((candidate) => {
      return (
        Vector2.distanceToSquared(candidate, normal) <= 1e-12 ||
        Vector2.distanceToSquared(candidate, normal.clone().reverse()) <= 1e-12
      )
    })

    if (!duplicate) {
      unique.push(normal)
    }
  }

  axes.push(...unique)

  return axes
}
