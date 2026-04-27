import { Affine2 } from 'hisabati'
import { Circle, Line2 } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function circleIntersection(
  a: Circle,
  b: Circle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(a, b, transform)
}

export function lineCircleIntersection(
  line: Line2,
  circle: Circle,
  transform: Affine2,
  _invTransform: Affine2
): Intersection2D[] | undefined {
  return intersectShapes2d(line, circle, transform)
}
