import { Affine2 } from 'hisabati'
import { Circle, Rectangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function rectangleIntersections(
  boxA: Rectangle,
  boxB: Rectangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(boxA, boxB, transform, tolerance)
}

export function circleRectangleIntersections(
  circle: Circle,
  rectangle: Rectangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(circle, rectangle, transform, tolerance)
}
