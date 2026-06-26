import { Affine2 } from 'hisabati'
import { Capsule, ConvexPolygon, Line2, Rectangle, Triangle } from '../../../shapes'
import { Intersection2D } from '../../../core'
import { intersectShapes2d } from './utils.js'

export function linesIntersection(
  a: Line2,
  b: Line2,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}

export function lineRectangleIntersection(
  a: Line2,
  b: Rectangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}

export function lineTriangleIntersection(
  a: Line2,
  b: Triangle,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}

export function lineCapsuleIntersection(
  a: Line2,
  b: Capsule,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}

export function lineConvexPolygonIntersection(
  a: Line2,
  b: ConvexPolygon,
  transform: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  return intersectShapes2d(a, b, transform, tolerance)
}
