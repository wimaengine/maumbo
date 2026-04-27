import { Affine2 } from 'hisabati'
import { Circle, Rectangle, Triangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function triangleIntersections(
  boxA: Triangle,
  boxB: Triangle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(boxA, boxB, transform)
}

export function triangleRectangleIntersections(
  boxA: Triangle,
  boxB: Rectangle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(boxA, boxB, transform)
}

export function circleTriangleIntersections(
  circle: Circle,
  triangle: Triangle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(circle, triangle, transform)
}
