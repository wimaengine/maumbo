import {
  Triangle,
  Rectangle,
  ConvexPolygon,
  getShape2Contacts,
  Circle,
  Capsule
} from 'maumbo'
import {
  Canvas2D,
  Gizmo2D,
  drawContacts
} from '@examples/utils'
import { Vector2, Affine2, Rotary } from 'hisabati'
import { Color } from 'marangi'

const canvas2d = new Canvas2D()
canvas2d.start([
  triangle1,
  triangle2,
  triangle3,
  triangle4,
  triangle5,
  triangleRectangle1,
  triangleRectangle2,
  triangleRectangle3,
  triangleRectangle4,
  triangleRectangle5,
  triangleCircle1,
  triangleCircle2,
  triangleCircle3,
  triangleCircle4,
  triangleCircle5,
  trianglePolygon1,
  trianglePolygon2,
  trianglePolygon3,
  trianglePolygon4,
  trianglePolygon5,
  triangleCapsule1,
  triangleCapsule2,
  triangleCapsule3,
  triangleCapsule4,
  triangleCapsule5
])

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangle1(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = new Triangle(50, 50)
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangle2(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = new Triangle(50, 50)
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(300, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangle3(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = new Triangle(50, 50,-1)
  const rect2 = new Triangle(50, 50)
  const center = new Vector2(500, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangle4(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = new Triangle(50, 50, 1)
  const rect2 = new Triangle(50, 50,-1)
  const center = new Vector2(700, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangle5(gizmo, time) {
  const elapsed = time * 0.001
  const rect1 = new Triangle(60, 60)
  const rect2 = new Triangle(40, 40)
  const center = new Vector2(900, 100)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(rect1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(rect2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleRectangle1(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const rect2 = new Rectangle(40, 40)
  const center = new Vector2(100, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleRectangle2(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const rect2 = new Rectangle(40, 40)
  const center = new Vector2(300, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleRectangle3(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const rect2 = new Rectangle(40, 40)
  const center = new Vector2(500, 300)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleRectangle4(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const rect2 = new Rectangle(30, 30)
  const center = new Vector2(700, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleRectangle5(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const rect2 = new Rectangle(30, 30)
  const center = new Vector2(900, 300)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, rect2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .aabb(rect2.halfWidth, rect2.halfHeight)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCircle1(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const circle2 = new Circle(40)
  const center = new Vector2(100, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCircle2(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const circle2 = new Circle(40)
  const center = new Vector2(300, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCircle3(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const circle2 = new Circle(40)
  const center = new Vector2(500, 500)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCircle4(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const circle2 = new Circle(30)
  const center = new Vector2(700, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCircle5(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const circle2 = new Circle(30)
  const center = new Vector2(900, 500)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, circle2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .circle(circle2.radius)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon1(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const poly2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const center = new Vector2(100, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon2(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const poly2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const center = new Vector2(300, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon3(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const poly2 = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const center = new Vector2(500, 700)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon4(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const poly2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(700, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function trianglePolygon5(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const poly2 = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(900, 700)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)
  
  const contacts = getShape2Contacts(tri1, poly2, transformA, transformB)
  
  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(poly2.getPoints(), Color.WHITE)
    .axes(30)
    .reset()
  
  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCapsule1(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const cap2 = new Capsule(20, 20)
  const center = new Vector2(100, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(tri1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCapsule2(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const cap2 = new Capsule(20, 20)
  const center = new Vector2(300, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(tri1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCapsule3(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(50, 50)
  const cap2 = new Capsule(20, 20)
  const center = new Vector2(500, 900)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(tri1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCapsule4(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const cap2 = new Capsule(15, 25)
  const center = new Vector2(700, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(tri1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function triangleCapsule5(gizmo, time) {
  const elapsed = time * 0.001
  const tri1 = new Triangle(60, 60)
  const cap2 = new Capsule(15, 25)
  const center = new Vector2(900, 900)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(tri1, cap2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .lineStrip(tri1.getPoints(), Color.WHITE)
    .axes(30)
    .setTransform(transformB)
    .capsule(cap2.radius, cap2.halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}
