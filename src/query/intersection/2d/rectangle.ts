import { Affine2 } from 'hisabati'
import { Circle, Rectangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function rectangleIntersections(
  boxA: Rectangle,
  boxB: Rectangle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(boxA, boxB, transform)
}

export function circleRectangleIntersections(
  circle: Circle,
  rectangle: Rectangle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(circle, rectangle, transform)
}
