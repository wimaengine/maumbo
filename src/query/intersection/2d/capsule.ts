import { Affine2 } from 'hisabati'
import { Capsule, Circle, ConvexPolygon, Rectangle, Triangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function capsuleIntersections(
  capsuleA: Capsule,
  capsuleB: Capsule,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(capsuleA, capsuleB, transform)
}

export function capsuleCircleIntersection(
  capsule: Capsule,
  circle: Circle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(capsule, circle, transform)
}

export function capsuleRectangleIntersection(
  a: Capsule,
  b: Rectangle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(a, b, transform)
}

export function capsuleTriangleIntersection(
  a: Capsule,
  b: Triangle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(a, b, transform)
}

export function capsuleConvexPolygonIntersection(
  a: Capsule,
  b: ConvexPolygon,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(a, b, transform)
}
