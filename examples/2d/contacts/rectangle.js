import {
  Rectangle,
  getShape2Contacts,
  Circle,
  Triangle,
  ConvexPolygon,
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
  rectangle1,
  rectangle2,
  rectangle3,
  rectangle4,
  rectangle5,
  rectangleCircle1,
  rectangleCircle2,
  rectangleCircle3,
  rectangleCircle4,
  rectangleCircle5,
  rectangleTriangle1,
  rectangleTriangle2,
  rectangleTriangle3,
  rectangleTriangle4,
  rectangleTriangle5,
  rectanglePolygon1,
  rectanglePolygon2,
  rectanglePolygon3,
  rectanglePolygon4,
  rectanglePolygon5,
  rectangleCapsule1,
  rectangleCapsule2,
  rectangleCapsule3,
  rectangleCapsule4,
  rectangleCapsule5
])

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectangle1(gizmo, time) {
  const elapsed = time * 0.001
  const width = 50
  const height = 50
  const rect1 = new Rectangle(width, height)
  const rect2 = new Rectangle(width, height)
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
    .aabb(width, height)
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
function rectangle2(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const rect1 = new Rectangle(width, height)
  const rect2 = new Rectangle(width, height)
  const center = new Vector2(300, 100)
  const transformA = new Affine2().translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(70, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
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
function rectangle3(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const rect1 = new Rectangle(width, height)
  const rect2 = new Rectangle(width, height)
  const center = new Vector2(500, 100)
  const transformA = new Affine2()
    .rotate(Rotary.fromAngle(-elapsed * 0.4))
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(70, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(rect1, rect2, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
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
function rectangle4(gizmo, time) {
  const elapsed = time * 0.001
  const width1 = 20
  const height1 = 20
  const width2 = 60
  const height2 = 60
  const rect1 = new Rectangle(width2, height2)
  const rect2 = new Rectangle(width1, height1)
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
    .aabb(width2, height2)
    .axes(30)
    .setTransform(transformB)
    .aabb(width1, height1)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectangle5(gizmo, time) {
  const elapsed = time * 0.001
  const width1 = 10
  const height1 = 10
  const width2 = 60
  const height2 = 60
  const rect1 = new Rectangle(width2, height2)
  const rect2 = new Rectangle(width1, height1)
  const center = new Vector2(900, 100)
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
    .aabb(width2, height2)
    .axes(30)
    .setTransform(transformB)
    .aabb(width1, height1)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function rectangleCircle1(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(100, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
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
    .aabb(width, height)
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
function rectangleCircle2(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(300, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
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
function rectangleCircle3(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 50
  const width = 40
  const height = 40
  const center = new Vector2(500, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
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
    .aabb(width, height)
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
function rectangleCircle4(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 20
  const width = 50
  const height = 50
  const center = new Vector2(700, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
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
function rectangleCircle5(gizmo, time) {
  const elapsed = time * 0.001
  const radius = 10
  const width = 50
  const height = 50
  const center = new Vector2(900, 500)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Circle(radius)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
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
function rectangleTriangle1(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const triBase = 50
  const triHeight = 50
  const center = new Vector2(100, 700)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Triangle(triBase, triHeight)
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
    .aabb(width, height)
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
function rectangleTriangle2(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const triBase = 50
  const triHeight = 50
  const center = new Vector2(300, 700)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
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
function rectangleTriangle3(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const triBase = 50
  const triHeight = 50
  const center = new Vector2(500, 700)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Triangle(triBase, triHeight)
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
    .aabb(width, height)
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
function rectangleTriangle4(gizmo, time) {
  const elapsed = time * 0.001
  const width1 = 50
  const height1 = 50
  const triBase = 40
  const triHeight = 40
  const center = new Vector2(700, 700)
  const shapeA = new Rectangle(width1, height1)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(30, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width1, height1)
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
function rectangleTriangle5(gizmo, time) {
  const elapsed = time * 0.001
  const width1 = 60
  const height1 = 60
  const triBase = 35
  const triHeight = 35
  const center = new Vector2(900, 700)
  const shapeA = new Rectangle(width1, height1)
  const shapeB = new Triangle(triBase, triHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width1, height1)
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
function rectanglePolygon1(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(6))
  const center = new Vector2(100, 900)
  const shapeA = new Rectangle(width, height)
  const shapeB = polygonB
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
    .aabb(width, height)
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
function rectanglePolygon2(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const center = new Vector2(300, 900)
  const shapeA = new Rectangle(width, height)
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
    .aabb(width, height)
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
function rectanglePolygon3(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const polygonB = ConvexPolygon.fromPoints(new Circle(50).getPoints(8))
  const center = new Vector2(500, 900)
  const shapeA = new Rectangle(width, height)
  const shapeB = polygonB
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
    .aabb(width, height)
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
function rectanglePolygon4(gizmo, time) {
  const elapsed = time * 0.001
  const width1 = 50
  const height1 = 50
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(700, 900)
  const shapeA = new Rectangle(width1, height1)
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
    .aabb(width1, height1)
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
function rectanglePolygon5(gizmo, time) {
  const elapsed = time * 0.001
  const width1 = 60
  const height1 = 60
  const polygonB = ConvexPolygon.fromPoints(new Circle(40).getPoints(10))
  const center = new Vector2(900, 900)
  const shapeA = new Rectangle(width1, height1)
  const shapeB = polygonB
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width1, height1)
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
function rectangleCapsule1(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const capRadius = 20
  const capHalfHeight = 20
  const center = new Vector2(100, 1100)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Capsule(capRadius, capHalfHeight)
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
    .aabb(width, height)
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
function rectangleCapsule2(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const capRadius = 20
  const capHalfHeight = 20
  const center = new Vector2(300, 1100)
  const shapeA = new Rectangle(width, height)
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
    .aabb(width, height)
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
function rectangleCapsule3(gizmo, time) {
  const elapsed = time * 0.001
  const width = 40
  const height = 40
  const capRadius = 20
  const capHalfHeight = 20
  const center = new Vector2(500, 1100)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Capsule(capRadius, capHalfHeight)
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
    .aabb(width, height)
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
function rectangleCapsule4(gizmo, time) {
  const elapsed = time * 0.001
  const width = 50
  const height = 50
  const capRadius = 15
  const capHalfHeight = 25
  const center = new Vector2(700, 1100)
  const shapeA = new Rectangle(width, height)
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
    .aabb(width, height)
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
function rectangleCapsule5(gizmo, time) {
  const elapsed = time * 0.001
  const width = 60
  const height = 60
  const capRadius = 15
  const capHalfHeight = 25
  const center = new Vector2(900, 1100)
  const shapeA = new Rectangle(width, height)
  const shapeB = new Capsule(capRadius, capHalfHeight)
  const transformA = new Affine2()
    .translate(center)
  const transformB = new Affine2()
    .translate(new Vector2(20, 0))
    .rotate(Rotary.fromAngle(elapsed * 0.4))
    .translate(center)

  const contacts = getShape2Contacts(shapeA, shapeB, transformA, transformB)

  gizmo
    .setTransform(transformA)
    .aabb(width, height)
    .axes(30)
    .setTransform(transformB)
    .capsule(capRadius, capHalfHeight)
    .axes(30)
    .reset()

  if (!drawContacts(gizmo, contacts, transformA, transformB)) return
}
