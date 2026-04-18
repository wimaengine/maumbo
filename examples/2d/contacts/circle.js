import {
  Circle,
  Line2,
  Capsule,
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
  circle1,
  circle2,
  circle3,
  circle4,
  circle5,
  circleLine1,
  circleLine2,
  circleLine3,
  circleLine4,
  circleLine5,
  circleRectangle1,
  circleRectangle2,
  circleRectangle3,
  circleRectangle4,
  circleRectangle5,
  circleTriangle1,
  circleTriangle2,
  circleTriangle3,
  circleTriangle4,
  circleTriangle5,
  circleCapsule1,
  circleCapsule2,
  circleCapsule3,
  circleCapsule4,
  circleCapsule5,
  circlePolygon1,
  circlePolygon2,
  circlePolygon3,
  circlePolygon4,
  circlePolygon5
])

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circle1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const center = new Vector2(100, 100)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circle2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const center = new Vector2(300, 100)
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circle3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const center = new Vector2(500, 100)
  const shapeA = new Circle(radius)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
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
function circle4(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 40
  const radius2 = 20
  const center = new Vector2(700, 100)
  const shapeA = new Circle(radius1)
  const shapeB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
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
function circle5(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 60
  const radius2 = 20
  const center = new Vector2(900, 100)
  const shapeA = new Circle(radius1)
  const shapeB = new Circle(radius2)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
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
function circleLine1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const length = 40
  const center = new Vector2(100, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleLine2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const length = 40
  const center = new Vector2(300, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleLine3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const length = 40
  const center = new Vector2(500, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleLine4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const length = 20
  const center = new Vector2(700, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleLine5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 60
  const length = 10
  const center = new Vector2(900, 300)
  const shapeA = new Circle(radius)
  const shapeB = new Line2(length)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .line(new Vector2(-length, 0), new Vector2(length, 0))
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleRectangle1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 500)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleRectangle2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 500)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleRectangle3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(500, 500)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleRectangle4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 20
  const height = 20
  const center = new Vector2(700, 500)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleRectangle5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 60
  const width = 10
  const height = 10
  const center = new Vector2(900, 500)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleTriangle1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 700)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleTriangle2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 700)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleTriangle3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(500, 700)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleTriangle4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 20
  const height = 20
  const center = new Vector2(700, 700)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleTriangle5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 60
  const width = 10
  const height = 10
  const center = new Vector2(900, 700)
  const shapeA = new Circle(radius)
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
    .circle(radius)
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
function circleCapsule1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const capRadius = 20
  const capHalfHeight = 30
  const center = new Vector2(100, 900)
  const shapeA = new Circle(radius)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleCapsule2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const capRadius = 20
  const capHalfHeight = 30
  const center = new Vector2(300, 900)
  const shapeA = new Circle(radius)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleCapsule3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const capRadius = 20
  const capHalfHeight = 30
  const center = new Vector2(500, 900)
  const shapeA = new Circle(radius)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleCapsule4(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 60
  const capRadius = 15
  const capHalfHeight = 25
  const center = new Vector2(700, 900)
  const shapeA = new Circle(radius1)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circleCapsule5(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 60
  const capRadius = 15
  const capHalfHeight = 25
  const center = new Vector2(900, 900)
  const shapeA = new Circle(radius1)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)

  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(100, 1100)
  const shapeA = new Circle(radius)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(300, 1100)
  const shapeA = new Circle(radius)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(12))
  const center = new Vector2(500, 1100)
  const shapeA = new Circle(radius)
  const shapeB = polygonB
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(elapsed * -0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon4(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 60
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(8))
  const center = new Vector2(700, 1100)
  const shapeA = new Circle(radius1)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(50, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function circlePolygon5(gizmo, time) {
  const elapsed = time * 0.001
  const radius1 = 60
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(8))
  const center = new Vector2(900, 1100)
  const shapeA = new Circle(radius1)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .circle(radius1)
    .axes(30)
    .setTransform(transformB)
    .lineStrip(polygonB.getPoints(), Color.WHITE)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}
