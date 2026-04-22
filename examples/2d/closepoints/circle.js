import {
  Affine2,
  Vector2,
  Rotary
} from 'hisabati'
import {
  Circle,
  getShape2ClosestPoints
} from 'maumbo'
import { Canvas2D, Gizmo2D } from '@examples/utils'
import { Color } from 'marangi'

const canvas2d = new Canvas2D()
canvas2d.start([circle])

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circle(gizmo, time) {
  const radius = 20
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const center = new Vector2(100, 100)
  const transformA = new Affine2().translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(time * 0.0004))
    .translate(center)

  const points = getShape2ClosestPoints(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius, Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(radius, Color.WHITE)
    .axes(30)

  if (!points) {
    return
  }

  points[0].transform(transformA, transformB)
  
  gizmo
    .reset()
    .translate(points[0].pointA.x, points[0].pointA.y)
    .circle(2, Color.RED)
    .reset()
    .translate(points[0].pointB.x, points[0].pointB.y)
    .circle(2, Color.BLUE)
    .reset()
    .line(points[0].pointA, points[0].pointB, Color.CYAN)
}
