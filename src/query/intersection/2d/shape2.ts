import { Affine2 } from 'hisabati'
import { Intersection2D } from '../../../core'
import { Circle, Capsule, Ellipse, Line2, Rectangle, ConvexPolygon, Triangle, type Shape2 } from '../../../shapes'
import {
  circleIntersection,
  lineCircleIntersection
} from './circle.js'
import {
  linesIntersection,
  lineRectangleIntersection,
  lineTriangleIntersection,
  lineCapsuleIntersection,
  lineConvexPolygonIntersection
} from './line.js'
import {
  rectangleIntersections,
  circleRectangleIntersections
} from './rectangle.js'
import {
  triangleIntersections,
  circleTriangleIntersections,
  triangleRectangleIntersections
} from './triangle.js'
import {
  polygonIntersections,
  polygonRectangleIntersections,
  polygonTriangleIntersections,
  circlePolygonIntersection
} from './polygon.js'
import {
  capsuleIntersections,
  capsuleCircleIntersection,
  capsuleRectangleIntersection,
  capsuleTriangleIntersection,
  capsuleConvexPolygonIntersection
} from './capsule.js'
import {
  ellipseEllipseIntersections, ellipseCircleIntersections, ellipseCapsuleIntersections,
  ellipseLineIntersections, ellipseRectangleIntersections, ellipsePolygonIntersections,
  ellipseTriangleIntersections
} from './ellipse.js'

export function getShape2Intersections(
  shapeA: Shape2 | Capsule,
  shapeB: Shape2 | Capsule,
  transformA: Affine2,
  transformB: Affine2,
  tolerance = 1e-8
): Intersection2D | undefined {
  const transform = Affine2.invert(transformA).multiply(transformB)
  const transformInv = Affine2.invert(transform)

  if (shapeA instanceof Circle && shapeB instanceof Circle) {
    return circleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Capsule && shapeB instanceof Capsule) {
    return capsuleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Rectangle) {
    return rectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof ConvexPolygon) {
    return polygonIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof Triangle) {
    return triangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Ellipse && shapeB instanceof Ellipse) {
    return ellipseEllipseIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Line2 && shapeB instanceof Circle) {
    return lineCircleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Circle && shapeB instanceof Line2) {
    return lineCircleIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Line2 && shapeB instanceof Line2) {
    return linesIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Line2 && shapeB instanceof Rectangle) {
    return lineRectangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Line2) {
    return lineRectangleIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Line2 && shapeB instanceof Triangle) {
    return lineTriangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof Line2) {
    return lineTriangleIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Line2 && shapeB instanceof Capsule) {
    return lineCapsuleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Capsule && shapeB instanceof Line2) {
    return lineCapsuleIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Line2 && shapeB instanceof ConvexPolygon) {
    return lineConvexPolygonIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Line2) {
    return lineConvexPolygonIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Triangle && shapeB instanceof Rectangle) {
    return triangleRectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Triangle) {
    return triangleRectangleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Triangle) {
    return polygonTriangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof ConvexPolygon) {
    return polygonTriangleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Rectangle) {
    return polygonRectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof ConvexPolygon) {
    return polygonRectangleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Circle && shapeB instanceof Triangle) {
    return circleTriangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof Circle) {
    return circleTriangleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Circle && shapeB instanceof Rectangle) {
    return circleRectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Circle) {
    return circleRectangleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Circle && shapeB instanceof ConvexPolygon) {
    return circlePolygonIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Circle) {
    return circlePolygonIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Capsule && shapeB instanceof Circle) {
    return capsuleCircleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Circle && shapeB instanceof Capsule) {
    return capsuleCircleIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Capsule && shapeB instanceof Rectangle) {
    return capsuleRectangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Capsule) {
    return capsuleRectangleIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Capsule && shapeB instanceof Triangle) {
    return capsuleTriangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof Capsule) {
    return capsuleTriangleIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Capsule && shapeB instanceof ConvexPolygon) {
    return capsuleConvexPolygonIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Capsule) {
    return capsuleConvexPolygonIntersection(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Ellipse && shapeB instanceof Circle) {
    return ellipseCircleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeB instanceof Ellipse && shapeA instanceof Circle) {
    return ellipseCircleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Ellipse && shapeB instanceof Capsule) {
    return ellipseCapsuleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeB instanceof Ellipse && shapeA instanceof Capsule) {
    return ellipseCapsuleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Ellipse && shapeB instanceof Line2) {
    return ellipseLineIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeB instanceof Ellipse && shapeA instanceof Line2) {
    return ellipseLineIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Ellipse && shapeB instanceof Rectangle) {
    return ellipseRectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeB instanceof Ellipse && shapeA instanceof Rectangle) {
    return ellipseRectangleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Ellipse && shapeB instanceof ConvexPolygon) {
    return ellipsePolygonIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeB instanceof Ellipse && shapeA instanceof ConvexPolygon) {
    return ellipsePolygonIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  } else if (shapeA instanceof Ellipse && shapeB instanceof Triangle) {
    return ellipseTriangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeB instanceof Ellipse && shapeA instanceof Triangle) {
    return ellipseTriangleIntersections(shapeB, shapeA, transformInv, tolerance)?.transform(transform)
  }

  return undefined
}
