import { Affine2 } from 'hisabati'
import { Intersection2D } from '../../../core'
import { Capsule, Shape2 } from '../../../shapes'
import { intersectShapes2d } from './utils.js'

export function getShape2Intersections(
  shapeA: Shape2 | Capsule,
  shapeB: Shape2 | Capsule,
  transformA: Affine2,
  transformB: Affine2
): Intersection2D[] | undefined {
  const transform = Affine2.invert(transformA).multiply(transformB)
  return intersectShapes2d(shapeA, shapeB, transform)
}
