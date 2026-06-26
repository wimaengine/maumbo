import { Affine2 } from 'hisabati'
import { Circle, Rectangle, Triangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function triangleIntersections(
  boxA: Triangle,
  boxB: Triangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(boxA, boxB, transform, tolerance)
}

export function triangleRectangleIntersections(
  boxA: Triangle,
  boxB: Rectangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(boxA, boxB, transform, tolerance)
}

export function circleTriangleIntersections(
  circle: Circle,
  triangle: Triangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(circle, triangle, transform, tolerance)
}
