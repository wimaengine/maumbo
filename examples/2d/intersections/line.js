import {
  Line2,
  Circle,
  Rectangle,
  Triangle,
  Capsule,
  ConvexPolygon,
  getShape2Intersections
} from 'maumbo'
import {
  Canvas2D,
  drawIntersections,
  Gizmo2D
} from '@examples/utils'
import { Vector2, Affine2, Rotary } from 'hisabati'
import { Color } from 'marangi'

const canvas2d = new Canvas2D()

const xPositions = [100, 300, 500, 700, 900]
const yPositions = {
  line: 100,
  circle: 300,
  rectangle: 500,
  triangle: 700,
  capsule: 900,
  polygon: 1100
}

const lineCases = [
  createDemo(line(50), line(50), xPositions[0], yPositions.line, 0, new Vector2(50, 0)),
  createDemo(line(50), line(50), xPositions[1], yPositions.line, 1, new Vector2(50, 0)),
  createDemo(line(50), line(50), xPositions[2], yPositions.line, 2, new Vector2(50, 0)),
  createDemo(line(60), line(30), xPositions[3], yPositions.line, 0, new Vector2(30, 0)),
  createDemo(line(60), line(30), xPositions[4], yPositions.line, 1, new Vector2(20, 0)),
]

const lineCircleCases = [
  createDemo(line(50), new Circle(40), xPositions[0], yPositions.circle, 0, new Vector2(50, 0)),
  createDemo(line(50), new Circle(40), xPositions[1], yPositions.circle, 1, new Vector2(50, 0)),
  createDemo(line(50), new Circle(40), xPositions[2], yPositions.circle, 2, new Vector2(50, 0)),
  createDemo(line(60), new Circle(20), xPositions[3], yPositions.circle, 0, new Vector2(35, 0)),
  createDemo(line(60), new Circle(20), xPositions[4], yPositions.circle, 1, new Vector2(25, 0)),
]

const lineRectangleCases = [
  createDemo(line(50), new Rectangle(40, 40), xPositions[0], yPositions.rectangle, 0, new Vector2(45, 0)),
  createDemo(line(50), new Rectangle(40, 40), xPositions[1], yPositions.rectangle, 1, new Vector2(45, 0)),
  createDemo(line(50), new Rectangle(40, 40), xPositions[2], yPositions.rectangle, 2, new Vector2(45, 0)),
  createDemo(line(60), new Rectangle(20, 20), xPositions[3], yPositions.rectangle, 0, new Vector2(25, 0)),
  createDemo(line(60), new Rectangle(20, 20), xPositions[4], yPositions.rectangle, 1, new Vector2(20, 0)),
]

const lineTriangleCases = [
  createDemo(line(50), new Triangle(45, 45), xPositions[0], yPositions.triangle, 0, new Vector2(45, 0)),
  createDemo(line(50), new Triangle(45, 45), xPositions[1], yPositions.triangle, 1, new Vector2(45, 0)),
  createDemo(line(50), new Triangle(45, 45), xPositions[2], yPositions.triangle, 2, new Vector2(45, 0)),
  createDemo(line(60), new Triangle(30, 30, -1), xPositions[3], yPositions.triangle, 0, new Vector2(25, 0)),
  createDemo(line(60), new Triangle(30, 30), xPositions[4], yPositions.triangle, 1, new Vector2(20, 0)),
]

const lineCapsuleCases = [
  createDemo(line(50), new Capsule(20, 20), xPositions[0], yPositions.capsule, 0, new Vector2(50, 0)),
  createDemo(line(50), new Capsule(20, 20), xPositions[1], yPositions.capsule, 1, new Vector2(50, 0)),
  createDemo(line(50), new Capsule(20, 20), xPositions[2], yPositions.capsule, 2, new Vector2(50, 0)),
  createDemo(line(60), new Capsule(10, 10), xPositions[3], yPositions.capsule, 0, new Vector2(25, 0)),
  createDemo(line(60), new Capsule(10, 10), xPositions[4], yPositions.capsule, 1, new Vector2(20, 0)),
]

const linePolygonCases = [
  createDemo(line(50), polygon(45, 6), xPositions[0], yPositions.polygon, 0, new Vector2(50, 0)),
  createDemo(line(50), polygon(45, 8), xPositions[1], yPositions.polygon, 1, new Vector2(50, 0)),
  createDemo(line(50), polygon(45, 6), xPositions[2], yPositions.polygon, 2, new Vector2(50, 0)),
  createDemo(line(60), polygon(20, 6), xPositions[3], yPositions.polygon, 0, new Vector2(25, 0)),
  createDemo(line(60), polygon(20, 8), xPositions[4], yPositions.polygon, 1, new Vector2(20, 0)),
]

canvas2d.start([
  ...lineCases,
  ...lineCircleCases,
  ...lineRectangleCases,
  ...lineTriangleCases,
  ...lineCapsuleCases,
  ...linePolygonCases
])

/**
 * @param {import("maumbo").Shape2} shapeA
 * @param {import("maumbo").Shape2} shapeB
 * @param {number} x
 * @param {number} y
 * @param {number} variant
 * @param {Vector2} offset
 */
function createDemo(shapeA, shapeB, x, y, variant, offset) {
  return function drawDemo(/** @type {Gizmo2D} */ gizmo, /** @type {number} */ time) {
    const elapsed = time * 0.001
    const center = new Vector2(x, y)
    const [transformA, transformB] = createTransforms(center, elapsed, variant, offset)
    const intersections = getShape2Intersections(shapeA, shapeB, transformA, transformB)

    gizmo
      .setTransform(transformA)
    drawShape(gizmo, shapeA)
    gizmo
      .axes(30)
      .setTransform(transformB)
    drawShape(gizmo, shapeB)
    gizmo
      .axes(30)
      .reset()

    if (!drawIntersections(gizmo, intersections, transformA, transformB)) return
  }
}

/**
 * @param {Vector2} center
 * @param {number} elapsed
 * @param {number} variant
 * @param {Vector2} offset
 */
function createTransforms(center, elapsed, variant, offset) {
  const transformA = variant === 2
    ? new Affine2()
      .rotate(Rotary.fromAngle(elapsed * -0.4))
      .translate(center)
    : new Affine2()
      .translate(center)

  const transformB = variant === 0
    ? new Affine2()
      .rotate(Rotary.fromAngle(elapsed * -0.4))
      .translate(offset)
      .rotate(Rotary.fromAngle(elapsed * 0.4))
      .translate(center)
    : new Affine2()
      .translate(offset)
      .rotate(Rotary.fromAngle(elapsed * 0.4))
      .translate(center)

  return [transformA, transformB]
}

/**
 * @param {Gizmo2D} gizmo
 * @param {import("maumbo").Shape2} shape
 */
function drawShape(gizmo, shape) {
  if (shape instanceof Line2) {
    gizmo.line(new Vector2(-shape.halfLength, 0), new Vector2(shape.halfLength, 0))
    return
  }

  if (shape instanceof Circle) {
    gizmo.circle(shape.radius)
    return
  }

  if (shape instanceof Rectangle) {
    gizmo.aabb(shape.halfWidth, shape.halfHeight)
    return
  }

  if (shape instanceof Triangle || shape instanceof ConvexPolygon) {
    gizmo.lineStrip(shape.getPoints(), Color.WHITE)
    return
  }

  if (shape instanceof Capsule) {
    gizmo.capsule(shape.radius, shape.halfHeight)
  }
}

/**
 * @param {number} length
 */
function line(length) {
  return new Line2(length)
}

/**
 * @param {number} radius
 * @param {number} sides
 */
function polygon(radius, sides) {
  return ConvexPolygon.fromPoints(new Circle(radius).getPoints(sides))
}
