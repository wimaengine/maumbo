import {
  Capsule,
  Circle,
  Rectangle,
  Triangle,
  ConvexPolygon,
  getShape2Contacts
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
  capsule1,
  capsule2,
  capsule3,
  capsule4,
  capsule5,
  capsuleCircle1,
  capsuleCircle2,
  capsuleCircle3,
  capsuleCircle4,
  capsuleCircle5,
  capsuleRectangle1,
  capsuleRectangle2,
  capsuleRectangle3,
  capsuleRectangle4,
  capsuleRectangle5,
  capsuleTriangle1,
  capsuleTriangle2,
  capsuleTriangle3,
  capsuleTriangle4,
  capsuleTriangle5,
  capsulePolygon1,
  capsulePolygon2,
  capsulePolygon3,
  capsulePolygon4,
  capsulePolygon5
])

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsule1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius, halfHeight)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius, halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsule2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius, halfHeight)
  const center = new Vector2(300, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius, halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsule3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius, halfHeight)
  const center = new Vector2(500, 100)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius, halfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsule4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const radius2 = 10
  const halfHeight2 = 10
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius2, halfHeight2)
  const center = new Vector2(700, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius2, halfHeight2)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsule5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const radius2 = 10
  const halfHeight2 = 10
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Capsule(radius2, halfHeight2)
  const center = new Vector2(900, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .capsule(radius2, halfHeight2)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleCircle1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const center = new Vector2(100, 300)
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleCircle2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const center = new Vector2(300, 300)
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleCircle3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const center = new Vector2(500, 300)
  const circleA = new Capsule(radius, halfHeight)
  const circleB = new Circle(radius)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .circle(radius)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleCircle4(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 20
  const halfHeight1 = 20
  const radius2 = 10
  const center = new Vector2(700, 300)
  const circleA = new Capsule(radius1, halfHeight1)
  const circleB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius1, halfHeight1)
    .axes(30)
    .setTransform(transformB)
    .circle(radius2)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleCircle5(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 30
  const halfHeight1 = 30
  const radius2 = 10
  const center = new Vector2(900, 300)
  const circleA = new Capsule(radius1, halfHeight1)
  const circleB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(circleA, circleB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius1, halfHeight1)
    .axes(30)
    .setTransform(transformB)
    .circle(radius2)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleRectangle1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 40
  const height = 40
  const center = new Vector2(100, 500)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleRectangle2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 40
  const height = 40
  const center = new Vector2(300, 500)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleRectangle3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 40
  const height = 40
  const center = new Vector2(500, 500)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleRectangle4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 20
  const height = 20
  const center = new Vector2(700, 500)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleRectangle5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 30
  const halfHeight = 30
  const width = 10
  const height = 10
  const center = new Vector2(900, 500)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Rectangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .aabb(width, height)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleTriangle1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 40
  const height = 40
  const center = new Vector2(100, 700)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleTriangle2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 40
  const height = 40
  const center = new Vector2(300, 700)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleTriangle3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 40
  const height = 40
  const center = new Vector2(500, 700)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleTriangle4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const width = 20
  const height = 20
  const center = new Vector2(700, 700)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsuleTriangle5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 30
  const halfHeight = 30
  const width = 10
  const height = 10
  const center = new Vector2(900, 700)
  const shapeA = new Capsule(radius, halfHeight)
  const shapeB = new Triangle(width, height)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsulePolygon1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const shapeB = ConvexPolygon.fromPoints(new Circle(30).getPoints(12))
  const center = new Vector2(100, 900)
  const shapeA = new Capsule(radius, halfHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsulePolygon2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const shapeB = ConvexPolygon.fromPoints(new Circle(30).getPoints(12))
  const center = new Vector2(300, 900)
  const shapeA = new Capsule(radius, halfHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsulePolygon3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const halfHeight = 20
  const shapeB = ConvexPolygon.fromPoints(new Circle(30).getPoints(12))
  const center = new Vector2(500, 900)
  const shapeA = new Capsule(radius, halfHeight)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(40, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsulePolygon4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 30
  const halfHeight = 30
  const shapeB = ConvexPolygon.fromPoints(new Circle(25).getPoints(8))
  const center = new Vector2(700, 900)
  const shapeA = new Capsule(radius, halfHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(35, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function capsulePolygon5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 30
  const halfHeight = 30
  const shapeB = ConvexPolygon.fromPoints(new Circle(25).getPoints(8))
  const center = new Vector2(900, 900)
  const shapeA = new Capsule(radius, halfHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(25, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .capsule(radius, halfHeight)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(shapeB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}
