import { Affine2 } from 'hisabati'
import { Capsule, Circle, ConvexPolygon, Rectangle, Triangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function capsuleIntersections(
  capsuleA: Capsule,
  capsuleB: Capsule,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(capsuleA, capsuleB, transform, tolerance)
}

export function capsuleCircleIntersection(
  capsule: Capsule,
  circle: Circle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(capsule, circle, transform, tolerance)
}

export function capsuleRectangleIntersection(
  a: Capsule,
  b: Rectangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}

export function capsuleTriangleIntersection(
  a: Capsule,
  b: Triangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}

export function capsuleConvexPolygonIntersection(
  a: Capsule,
  b: ConvexPolygon,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}
