import { SAT2d, sat2dCircle } from '../../../core'
import { Circle, Rectangle, ConvexPolygon, Triangle } from '../../../shapes'
import { Vector2, Affine2 } from 'hisabati'
import { getNearVertex } from './utils.js'

/**
 * @param {ConvexPolygon} boxA
 * @param {ConvexPolygon} boxB
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function polygonContacts(
  boxA: ConvexPolygon,
  boxB: ConvexPolygon,
  transform: Affine2,
  invTransform: Affine2
): ReturnType<typeof SAT2d> {
  const pointsA = boxA.points.map((e: Vector2) => e.clone())
  const pointsB = boxB.points.map((e: Vector2) => transform.transform(e.clone()))
  
  const axes = [
    ...boxA.normals.map((e: Vector2) => e.clone()),
    ...boxB.normals.map((e: Vector2) => Affine2.transformWithoutTranslation(transform, e))
  ]

  return SAT2d(pointsA, pointsB, axes, transform, invTransform)
}

/**
 * @param {Circle} circle
 * @param {ConvexPolygon} polygon
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function circlePolygonContact(
  circle: Circle,
  polygon: ConvexPolygon,
  transform: Affine2,
  invTransform: Affine2
): ReturnType<typeof sat2dCircle> {
  const points = polygon.points.map((e: Vector2) => transform.transform(e.clone()))
  
  const nearestIndex = getNearVertex(Vector2.Zero, points)
  const axis = Vector2.copy(
    points[nearestIndex]
  )
  const length = axis.magnitudeSquared()

  if (length === 0) {
    axis.set(transform.x, transform.y)
  }
  
  axis.normalize()
  const axes = [
    axis,
    ...polygon.normals.map((e: Vector2) => Affine2.transformWithoutTranslation(transform, e))
  ]

  return sat2dCircle(circle, points, axes, transform, invTransform)
}

/**
 * @param {ConvexPolygon} boxA
 * @param {Rectangle} boxB
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function polygonRectangleContacts(
  boxA: ConvexPolygon,
  boxB: Rectangle,
  transform: Affine2,
  invTransform: Affine2
): ReturnType<typeof SAT2d> {
  const pointsA = boxA.points.map((e: Vector2) => e.clone())
  const pointsB = boxB.getPoints().map((e: Vector2) => transform.transform(e))
  
  if (pointsB.length < 3) {
    return undefined
  }

  const axes = [
    ...boxA.normals.map((e: Vector2) => e.clone()),
    Vector2.normal(Vector2.subtract(pointsB[0], pointsB[1])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[1], pointsB[2])).normalize()
  ]

  return SAT2d(pointsA, pointsB, axes, transform, invTransform)
}

/**
 * @param {ConvexPolygon} boxA
 * @param {Triangle} boxB
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function polygonTriangleContacts(
  boxA: ConvexPolygon,
  boxB: Triangle,
  transform: Affine2,
  invTransform: Affine2
): ReturnType<typeof SAT2d> {
  const pointsA = boxA.points.map((e: Vector2) => e.clone())
  const pointsB = boxB.getPoints().map((e: Vector2) => transform.transform(e))

  if (pointsA.length < 3) {
    return undefined
  }
  
  const axes = [
    ...boxA.normals.map((e: Vector2) => e.clone()),
    Vector2.normal(Vector2.subtract(pointsB[0], pointsB[1])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[1], pointsB[2])).normalize(),
    Vector2.normal(Vector2.subtract(pointsB[2], pointsB[0])).normalize()
  ]

  return SAT2d(pointsA, pointsB, axes, transform, invTransform)
}
