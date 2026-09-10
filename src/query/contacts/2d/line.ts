import { Affine2, Vector2 } from 'hisabati'
import { Contact2D } from '../../../core'
import { gjkEPAContact2d } from './utils.js'
import { satContact2d } from './utils.js'
import { Circle, ConvexPolygon, Line2, Rectangle, Triangle } from '../../../shapes'

/**
 * @param {Line2} a
 * @param {Line2} b
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function linesContact(
  a: Line2,
  b: Line2,
  transform: Affine2,
  invTransform: Affine2
): Contact2D | undefined {
  const a0Local = new Vector2(a.halfLength, 0)
  const a1Local = new Vector2(-a.halfLength, 0)
  const a0 = Affine2.transform(invTransform, a0Local)
  const a1 = Affine2.transform(invTransform, a1Local)

  const b0 = new Vector2(b.halfLength, 0)
  const b1 = new Vector2(-b.halfLength, 0)

  const da = Vector2.subtract(a1, a0)
  const db = Vector2.subtract(b1, b0)
  const r = Vector2.subtract(a0, b0)

  const aLenSq = Vector2.dot(da, da)
  const bLenSq = Vector2.dot(db, db)
  const ab = Vector2.dot(da, db)

  const EPS = 1e-8

  let s: number
  let t: number

  if (aLenSq < EPS && bLenSq < EPS) {
    s = t = 0
  } else if (aLenSq < EPS) {
    s = 0
    t = Math.max(0, Math.min(1, Vector2.dot(db, r) / bLenSq))
  } else if (bLenSq < EPS) {
    t = 0
    s = Math.max(0, Math.min(1, -Vector2.dot(da, r) / aLenSq))
  } else {
    const denom = aLenSq * bLenSq - ab * ab

    if (Math.abs(denom) < EPS) {
      s = 0
      t = Math.max(0, Math.min(1, Vector2.dot(db, r) / bLenSq))
    } else {
      s = (ab * Vector2.dot(db, r) - bLenSq * Vector2.dot(da, r)) / denom
      t = (aLenSq * Vector2.dot(db, r) - ab * Vector2.dot(da, r)) / denom

      s = Math.max(0, Math.min(1, s))
      t = Math.max(0, Math.min(1, t))
    }
  }

  const closestA = Vector2.add(a0, Vector2.multiplyScalar(da, s))
  const closestB = Vector2.add(b0, Vector2.multiplyScalar(db, t))

  const delta = Vector2.subtract(closestA, closestB)
  const distSq = Vector2.dot(delta, delta)

  if (distSq > EPS * EPS) {
    return undefined
  }

  let normalB = new Vector2(db.y, -db.x)

  if (normalB.magnitudeSquared() < EPS) {
    normalB = new Vector2(da.y, -da.x)
  }

  normalB = normalB.normalize()

  const normalA = Affine2
    .transformWithoutTranslation(transform, normalB)
    .reverse()

  const contactB = closestB
  const contactA = Vector2.add(
    a0Local,
    Vector2.multiplyScalar(Vector2.subtract(a1Local, a0Local), s)
  )

  return new Contact2D(
    contactA,
    contactB,
    normalA,
    normalB,
    0
  )
}

/**
 * @param {Line2} a
 * @param {Circle} b
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function lineCircleContact(
  a: Line2,
  b: Circle,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  return gjkEPAContact2d(a, b, transform, invTransform)
}

/**
 * @param {Line2} a
 * @param {Rectangle} b
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function lineRectangleContact(
  a: Line2,
  b: Rectangle,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const pointsA = [
    new Vector2(-a.halfLength, 0),
    new Vector2(a.halfLength, 0)
  ]
  const pointsB = b.getPoints().map((point) => Affine2.transform(transform, point))
  const axes = [
    Vector2.Y.clone(),
    Vector2.normal(Vector2.subtract(pointsB[0], pointsB[1])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[1], pointsB[2])).normalize()
  ]

  return satContact2d(pointsA, pointsB, axes, transform, invTransform)
}

/**
 * @param {Line2} a
 * @param {Triangle} b
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function lineTriangleContact(
  a: Line2,
  b: Triangle,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const pointsA = [
    new Vector2(-a.halfLength, 0),
    new Vector2(a.halfLength, 0)
  ]
  const pointsB = b.getPoints().map((point) => Affine2.transform(transform, point))
  const axes = [
    Vector2.Y.clone(),
    Vector2.normal(Vector2.subtract(pointsB[0], pointsB[1])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[1], pointsB[2])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[2], pointsB[0])).normalize()
  ]

  return satContact2d(pointsA, pointsB, axes, transform, invTransform)
}

/**
 * @param {Line2} a
 * @param {ConvexPolygon} b
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function lineConvexPolygonContact(
  a: Line2,
  b: ConvexPolygon,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const pointsA = [
    new Vector2(-a.halfLength, 0),
    new Vector2(a.halfLength, 0)
  ]
  const pointsB = b.points.map((point) => Affine2.transform(transform, point.clone()))
  const axes = [
    Vector2.Y.clone(),
    ...b.normals.map((normal) => Affine2.transformWithoutTranslation(transform, normal))
  ]

  return satContact2d(pointsA, pointsB, axes, transform, invTransform)
}
