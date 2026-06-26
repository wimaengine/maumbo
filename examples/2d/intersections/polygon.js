import {
  Triangle,
  Rectangle,
  ConvexPolygon,
  getShape2Intersections,
  Circle,
  Capsule,
  Line2
} from 'maumbo'
import {
  Canvas2D,
  Gizmo2D,
  drawIntersections
} from '@examples/utils'
import { Vector2, Affine2, Rotary } from 'hisabati'
import { Color } from 'marangi'

const canvas2d = new Canvas2D()
canvas2d.start([
  polygons,
  polygons2,
  polygons3,
  polygons4,
  polygons5,
  rectanglePolygon,
  rectanglePolygon2,
  rectanglePolygon3,
  rectanglePolygon4,
  rectanglePolygon5,
  trianglePolygon,
  trianglePolygon2,
  trianglePolygon3,
  trianglePolygon4,
  trianglePolygon5,
  circlePolygon,
  circlePolygon2,
  circlePolygon3,
  circlePolygon4,
  circlePolygon5,
  polygonCapsule1,
  polygonCapsule2,
  polygonCapsule3,
  polygonCapsule4,
  polygonCapsule5,
  polygonLine1,
  polygonLine2,
  polygonLine3,
  polygonLine4,
  polygonLine5
])

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygons(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectanglePolygon(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(100, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectanglePolygon2(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(300, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(100, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon2(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(300, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = new Circle(50)
  const center = new Vector2(100, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon2(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Circle(50)
  const center = new Vector2(300, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygons2(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(300, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygons3(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const rect2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(500, 100)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygons4(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(700, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygons5(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(900, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectanglePolygon3(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(500, 300)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectanglePolygon4(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(700, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectanglePolygon5(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Rectangle(50, 50)
  const center = new Vector2(900, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight, Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon3(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(500, 500)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon4(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Triangle(40, 40)
  const center = new Vector2(700, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon5(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Triangle(40, 40)
  const center = new Vector2(900, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon3(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const rect2 = new Circle(40)
  const center = new Vector2(500, 700)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon4(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Circle(30)
  const center = new Vector2(700, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon5(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const rect2 = new Circle(30)
  const center = new Vector2(900, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const intersection = getShape2Intersections(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(rect2.radius)
    .axes(30)
    .reset()
  
  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonCapsule1(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const cap2 = new Capsule(20, 20)
  const center = new Vector2(100, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonCapsule2(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const cap2 = new Capsule(20, 20)
  const center = new Vector2(300, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonCapsule3(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const cap2 = new Capsule(20, 20)
  const center = new Vector2(500, 900)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonCapsule4(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const cap2 = new Capsule(15, 25)
  const center = new Vector2(700, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonCapsule5(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(60).getPoints(8))
  const cap2 = new Capsule(15, 25)
  const center = new Vector2(900, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonLine1(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const line2 = new Line2(50)
  const center = new Vector2(100, 1100)
  const transformA = new Affine2().translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, line2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-line2.halfLength, 0), new Vector2(line2.halfLength, 0))
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonLine2(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const line2 = new Line2(50)
  const center = new Vector2(300, 1100)
  const transformA = new Affine2().translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, line2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-line2.halfLength, 0), new Vector2(line2.halfLength, 0))
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonLine3(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const line2 = new Line2(50)
  const center = new Vector2(500, 1100)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, line2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-line2.halfLength, 0), new Vector2(line2.halfLength, 0))
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonLine4(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(20).getPoints(6))
  const line2 = new Line2(60)
  const center = new Vector2(700, 1100)
  const transformA = new Affine2().translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(25, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, line2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-line2.halfLength, 0), new Vector2(line2.halfLength, 0))
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function polygonLine5(gizmo, time) {
  const elapsed = time * 0.001
  const poly1 = ConvexPolygon.fromPoints(new Circle(20).getPoints(8))
  const line2 = new Line2(60)
  const center = new Vector2(900, 1100)
  const transformA = new Affine2().translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const intersection = getShape2Intersections(poly1, line2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(poly1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-line2.halfLength, 0), new Vector2(line2.halfLength, 0))
    .axes(30)
    .reset()

  if (!drawIntersections(gizmo, intersection, transformA)) return
}
