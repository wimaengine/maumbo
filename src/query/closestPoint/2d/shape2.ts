import { Affine2 } from 'hisabati'
import { Circle, Ellipse } from '../../../shapes'
import  { type Shape2 } from '../../../shapes'
import { getCircleClosestPoint } from './circle.js'
import { ellipseCircleClosestPoint, ellipseEllipseClosestPoint } from './ellipse.js'
import type { ClosestPoint2D } from '../../../core'

export function getShape2ClosestPoints(
  shapeA: Shape2,
  shapeB: Shape2,
  transformA: Affine2,
  transformB: Affine2
): ClosestPoint2D[] | undefined {
  const transform = Affine2.multiply(
    Affine2.invert(transformA, new Affine2()),
    transformB
  )
  
  if(shapeA instanceof Circle && shapeB instanceof Circle) {
    return [getCircleClosestPoint(shapeA, shapeB, transform)]
  }

  if (shapeA instanceof Ellipse && shapeB instanceof Ellipse) {
    return [ellipseEllipseClosestPoint(shapeA, shapeB, transform)]
  }

  if (shapeA instanceof Ellipse && shapeB instanceof Circle) {
    return [ellipseCircleClosestPoint(shapeA, shapeB, transform)]
  }

  if (shapeA instanceof Circle && shapeB instanceof Ellipse) {
    const closest = ellipseCircleClosestPoint(shapeB, shapeA, Affine2.invert(transform, new Affine2()))
    closest.flip()
    return [closest]
  }

  return undefined
}
