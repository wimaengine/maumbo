import { Affine2 } from 'hisabati'
import { Circle, ConvexPolygon, Rectangle, Triangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function polygonIntersections(
  boxA: ConvexPolygon,
  boxB: ConvexPolygon,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(boxA, boxB, transform, tolerance)
}

export function circlePolygonIntersection(
  circle: Circle,
  polygon: ConvexPolygon,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(circle, polygon, transform, tolerance)
}

export function polygonRectangleIntersections(
  boxA: ConvexPolygon,
  boxB: Rectangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(boxA, boxB, transform, tolerance)
}

export function polygonTriangleIntersections(
  boxA: ConvexPolygon,
  boxB: Triangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(boxA, boxB, transform, tolerance)
}
