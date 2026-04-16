import { ClosestPoint2D } from '../../../core'
import { Vector2, Affine2 } from 'hisabati'
import { Circle } from '../../../shapes'

export function getCircleClosestPoint(
  circleA: Circle,
  circleB: Circle,
  transform: Affine2
): ClosestPoint2D {
  const dx = transform.x
  const dy = transform.y
  const distSquared = dx * dx + dy * dy
  const radiiSum = circleA.radius + circleB.radius
  const distance = Math.sqrt(distSquared)
  const normal1 = distance !== 0 ? new Vector2(dx / distance, dy / distance) : Vector2.copy(Vector2.Y)
  const inverse = Affine2.invert(transform, new Affine2())
  const normal2 = Vector2.reverse(
    Affine2.transformWithoutTranslation(inverse, normal1, new Vector2())
  )
  
  const penetration = distance - radiiSum
  
  return new ClosestPoint2D(
    Vector2.multiplyScalar(normal1, circleA.radius),
    Vector2.multiplyScalar(normal2, circleB.radius),
    penetration
  )
}
