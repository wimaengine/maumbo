import { Affine2, Vector2 } from 'hisabati'
import { ClosestPoint2D } from '../../../core'
import { Circle, Ellipse } from '../../../shapes'
import { getClosestPoints } from './utils.js'

const ELLIPSE_SAMPLES = 128

export function ellipseEllipseClosestPoint(
  ellipseA: Ellipse,
  ellipseB: Ellipse,
  transform: Affine2
): ClosestPoint2D {
  const pointsA = ellipseA.getPoints(ELLIPSE_SAMPLES)
  const pointsB = ellipseB.getPoints(ELLIPSE_SAMPLES).map((point: Vector2) => Affine2.transform(transform, point))
  const closest = getClosestPoints(pointsA, pointsB)[0]
  const inverse = Affine2.invert(transform, new Affine2())

  if (!closest) {
    return new ClosestPoint2D(Vector2.Zero.clone(), Vector2.Zero.clone(), Infinity)
  }

  closest.pointB = Affine2.transform(inverse, closest.pointB)
  return closest
}

export function ellipseCircleClosestPoint(
  ellipse: Ellipse,
  circle: Circle,
  transform: Affine2
): ClosestPoint2D {
  const pointsA = ellipse.getPoints(ELLIPSE_SAMPLES)
  const pointsB = circle.getPoints(ELLIPSE_SAMPLES).map((point: Vector2) => Affine2.transform(transform, point))
  const closest = getClosestPoints(pointsA, pointsB)[0]
  const inverse = Affine2.invert(transform, new Affine2())

  if (!closest) {
    return new ClosestPoint2D(Vector2.Zero.clone(), Vector2.Zero.clone(), Infinity)
  }

  closest.pointB = Affine2.transform(inverse, closest.pointB)
  return closest
}
