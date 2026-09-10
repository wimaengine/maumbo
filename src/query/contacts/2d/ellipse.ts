import { Affine2 } from 'hisabati'
import { Contact2D, GJKandEPA2d } from '../../../core'
import { Capsule, Circle, ConvexPolygon, Ellipse, Line2, Rectangle, Triangle } from '../../../shapes'

export function ellipseEllipseContacts(ellipseA: Ellipse, ellipseB: Ellipse, transform: Affine2, invTransform: Affine2): Contact2D[] | undefined {
  return GJKandEPA2d(ellipseA, ellipseB, transform, invTransform)
}

export function ellipseCircleContacts(ellipse: Ellipse, circle: Circle, transform: Affine2, invTransform: Affine2): Contact2D[] | undefined {
  return GJKandEPA2d(ellipse, circle, transform, invTransform)
}

export function ellipseCapsuleContacts(ellipse: Ellipse, capsule: Capsule, transform: Affine2, invTransform: Affine2): Contact2D[] | undefined {
  return GJKandEPA2d(ellipse, capsule, transform, invTransform)
}

export function ellipseLineContacts(ellipse: Ellipse, line: Line2, transform: Affine2, invTransform: Affine2): Contact2D[] | undefined {
  return GJKandEPA2d(ellipse, line, transform, invTransform)
}

export function ellipseRectangleContacts(ellipse: Ellipse, rectangle: Rectangle, transform: Affine2, invTransform: Affine2): Contact2D[] | undefined {
  return GJKandEPA2d(ellipse, rectangle, transform, invTransform)
}

export function ellipsePolygonContacts(ellipse: Ellipse, polygon: ConvexPolygon, transform: Affine2, invTransform: Affine2): Contact2D[] | undefined {
  return GJKandEPA2d(ellipse, polygon, transform, invTransform)
}

export function ellipseTriangleContacts(ellipse: Ellipse, triangle: Triangle, transform: Affine2, invTransform: Affine2): Contact2D[] | undefined {
  return GJKandEPA2d(ellipse, triangle, transform, invTransform)
}
