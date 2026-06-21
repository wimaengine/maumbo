import { Affine2 } from 'hisabati'
import { Circle } from '../../../shapes'
import  { type Shape2 } from '../../../shapes'
import { getCircleClosestPoint } from './circle.js'
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

  return undefined
}
