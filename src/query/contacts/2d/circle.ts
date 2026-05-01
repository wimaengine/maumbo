import { Contact2D } from '../../../core'
import { Circle } from '../../../shapes'
import { Vector2, Affine2 } from 'hisabati'

/**
 * @param {Circle} a
 * @param {Circle} b
 * @param {Affine2} transform
 * @param {Affine2} invTransform
 */
export function circleContact(
  a: Circle,
  b: Circle,
  transform: Affine2,
  invTransform: Affine2
): Contact2D | undefined {
  const dx = transform.x
  const dy = transform.y
  const distSquared = dx * dx + dy * dy
  const radiiSum = a.radius + b.radius
  const distance = Math.sqrt(distSquared)
  
  if (distance >= radiiSum) {
    return undefined
  }
  
  const penetration = radiiSum - distance
  const normalA = distance !== 0 ? new Vector2(dx / distance, dy / distance) : Vector2.Y.clone()
  const normalB = Affine2.transformWithoutTranslation(invTransform, normalA).reverse()
  const tangentA = Vector2.normal(normalA)
  const tangentB = Vector2.normal(normalB)
  
  return new Contact2D(
    Vector2.multiplyScalar(normalA, a.radius),
    Vector2.multiplyScalar(normalB, b.radius),
    normalA,
    normalB,
    penetration,
    tangentA,
    tangentB
  )
}

