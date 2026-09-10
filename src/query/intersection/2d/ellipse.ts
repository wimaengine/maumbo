import { Affine2 } from 'hisabati'
import { Intersection2D } from '../../../core'
import { Capsule, Circle, ConvexPolygon, Ellipse, Line2, Rectangle, Triangle } from '../../../shapes'
import { intersectShapes2d } from './utils.js'

export function ellipseEllipseIntersections(ellipseA: Ellipse, ellipseB: Ellipse, transform: Affine2, tolerance = 1e-8): Intersection2D | undefined {
  return intersectShapes2d(ellipseA, ellipseB, transform, tolerance)
}

export function ellipseCircleIntersections(ellipse: Ellipse, circle: Circle, transform: Affine2, tolerance = 1e-8): Intersection2D | undefined {
  return intersectShapes2d(ellipse, circle, transform, tolerance)
}

export function ellipseCapsuleIntersections(ellipse: Ellipse, capsule: Capsule, transform: Affine2, tolerance = 1e-8): Intersection2D | undefined {
  return intersectShapes2d(ellipse, capsule, transform, tolerance)
}

export function ellipseLineIntersections(ellipse: Ellipse, line: Line2, transform: Affine2, tolerance = 1e-8): Intersection2D | undefined {
  return intersectShapes2d(ellipse, line, transform, tolerance)
}

export function ellipseRectangleIntersections(ellipse: Ellipse, rectangle: Rectangle, transform: Affine2, tolerance = 1e-8): Intersection2D | undefined {
  return intersectShapes2d(ellipse, rectangle, transform, tolerance)
}

export function ellipsePolygonIntersections(ellipse: Ellipse, polygon: ConvexPolygon, transform: Affine2, tolerance = 1e-8): Intersection2D | undefined {
  return intersectShapes2d(ellipse, polygon, transform, tolerance)
}

export function ellipseTriangleIntersections(ellipse: Ellipse, triangle: Triangle, transform: Affine2, tolerance = 1e-8): Intersection2D | undefined {
  return intersectShapes2d(ellipse, triangle, transform, tolerance)
}
