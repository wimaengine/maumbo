import { Affine2, Vector2 } from 'hisabati'
import { Intersection2D } from '../../../core'
import { Circle, Capsule, Line2, Rectangle, ConvexPolygon, Triangle, type Shape2 } from '../../../shapes'
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
  } else if (shapeA instanceof Line2 && shapeB instanceof Circle) {
    return lineCircleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Circle && shapeB instanceof Line2) {
    return transformIntersections(
      lineCircleIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Line2 && shapeB instanceof Line2) {
    return linesIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Line2 && shapeB instanceof Rectangle) {
    return lineRectangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Line2) {
    return transformIntersections(
      lineRectangleIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Line2 && shapeB instanceof Triangle) {
    return lineTriangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof Line2) {
    return transformIntersections(
      lineTriangleIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Line2 && shapeB instanceof Capsule) {
    return lineCapsuleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Capsule && shapeB instanceof Line2) {
    return transformIntersections(
      lineCapsuleIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Line2 && shapeB instanceof ConvexPolygon) {
    return lineConvexPolygonIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Line2) {
    return transformIntersections(
      lineConvexPolygonIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Triangle && shapeB instanceof Rectangle) {
    return triangleRectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Triangle) {
    return transformIntersections(
      triangleRectangleIntersections(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Triangle) {
    return polygonTriangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof ConvexPolygon) {
    return transformIntersections(
      polygonTriangleIntersections(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Rectangle) {
    return polygonRectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof ConvexPolygon) {
    return transformIntersections(
      polygonRectangleIntersections(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Circle && shapeB instanceof Triangle) {
    return circleTriangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof Circle) {
    return transformIntersections(
      circleTriangleIntersections(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Circle && shapeB instanceof Rectangle) {
    return circleRectangleIntersections(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Circle) {
    return transformIntersections(
      circleRectangleIntersections(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Circle && shapeB instanceof ConvexPolygon) {
    return circlePolygonIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Circle) {
    return transformIntersections(
      circlePolygonIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Capsule && shapeB instanceof Circle) {
    return capsuleCircleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Circle && shapeB instanceof Capsule) {
    return transformIntersections(
      capsuleCircleIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Capsule && shapeB instanceof Rectangle) {
    return capsuleRectangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Rectangle && shapeB instanceof Capsule) {
    return transformIntersections(
      capsuleRectangleIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Capsule && shapeB instanceof Triangle) {
    return capsuleTriangleIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof Triangle && shapeB instanceof Capsule) {
    return transformIntersections(
      capsuleTriangleIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  } else if (shapeA instanceof Capsule && shapeB instanceof ConvexPolygon) {
    return capsuleConvexPolygonIntersection(shapeA, shapeB, transform, tolerance)
  } else if (shapeA instanceof ConvexPolygon && shapeB instanceof Capsule) {
    return transformIntersections(
      capsuleConvexPolygonIntersection(shapeB, shapeA, transformInv, tolerance),
      transform
    )
  }

  return undefined
}

function transformIntersections(
  intersection: Intersection2D | undefined,
  transform: Affine2
): Intersection2D | undefined {
  if (!intersection) {
    return undefined
  }

  for (const point of intersection.points) {
    if (point instanceof Vector2) {
      Affine2.transform(transform, point, point)
    } else {
      Affine2.transform(transform, point.start, point.start)
      Affine2.transform(transform, point.end, point.end)
    }
  }

  for (const normal of intersection.normals) {
    Affine2.transformWithoutTranslation(transform, normal, normal)
  }

  return intersection
}
