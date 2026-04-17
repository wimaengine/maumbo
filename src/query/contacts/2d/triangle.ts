import { Vector2, Affine2 } from 'hisabati'
import { SAT2d, sat2dCircle } from '../../../core'
import { Circle, Rectangle, Triangle } from '../../../shapes'
import { getNearVertex } from './utils.js'

/**
 * @param {Triangle} boxA
 * @param {Triangle} boxB
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function triangleContacts(
  boxA: Triangle,
  boxB: Triangle,
  transform: Affine2,
  invTransform: Affine2
): ReturnType<typeof SAT2d> {
  const pointsA = boxA.getPoints()
  const pointsB = boxB.getPoints().map((e: Vector2) => transform.transform(e))
  
  if (pointsA.length < 3 || pointsB.length < 3) {
    return undefined
  }

  const axes = [
    Vector2.subtract(pointsA[0], pointsA[1]).normalize(),
    Vector2.subtract(pointsA[1], pointsA[2]).normalize(),
    Vector2.subtract(pointsA[2], pointsA[0]).normalize(),
    Vector2.subtract(pointsB[0], pointsB[1]).normalize(),
    Vector2.subtract(pointsB[1], pointsB[2]).normalize(),
    Vector2.subtract(pointsB[2], pointsB[0]).normalize()
  ].map((axis) => Vector2.normal(axis, axis))

  return SAT2d(pointsA, pointsB, axes, transform, invTransform)
}

/**
 * @param {Triangle} boxA
 * @param {Rectangle} boxB
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function triangleRectangleContacts(
  boxA: Triangle,
  boxB: Rectangle,
  transform: Affine2,
  invTransform: Affine2
): ReturnType<typeof SAT2d> {
  const pointsA = boxA.getPoints()
  const pointsB = boxB.getPoints().map((e: Vector2) => transform.transform(e))
  
  if (pointsA.length < 3 || pointsB.length < 4) {
    return undefined
  }

  const axes = [
    Vector2.subtract(pointsA[0], pointsA[1]).normalize(),
    Vector2.subtract(pointsA[1], pointsA[2]).normalize(),
    Vector2.subtract(pointsA[2], pointsA[0]).normalize(),
    Vector2.subtract(pointsB[0], pointsB[1]).normalize(),
    Vector2.subtract(pointsB[1], pointsB[2]).normalize()
  ].map((axis) => Vector2.normal(axis, axis))

  return SAT2d(pointsA, pointsB, axes, transform, invTransform)
}

/**
 * @param {Circle} circle
 * @param {Triangle} triangle
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function circleTriangleContacts(
  circle: Circle,
  triangle: Triangle,
  transform: Affine2,
  invTransform: Affine2
): ReturnType<typeof sat2dCircle> {
  const points = triangle.getPoints().map((e: Vector2) => transform.transform(e.clone()))
  
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
    Vector2.normal(Vector2.subtract(points[0], points[1])).normalize(),
    Vector2.normal(Vector2.subtract(points[1], points[2])).normalize(),
    Vector2.normal(Vector2.subtract(points[2], points[0])).normalize()
  ]

  return sat2dCircle(circle, points, axes, transform, invTransform)
}
