import {
  Capsule,
  Circle,
  ConvexPolygon,
  Ellipse,
  Line2,
  Rectangle,
  Triangle
} from 'maumbo'
import {
  Canvas2D,
  Gizmo2D
} from '@examples/utils'
import { Affine2, Rotary, Vector2 } from 'hisabati'
import { Color } from 'marangi'

const SHAPE_COLOR = Color.WHITE
const BOUNDS_COLOR = Color.CYAN
const AXIS_LENGTH = 24
const BOUNDS_RESOLUTION = 64
const ROTATION_SPEED = 0.00045

const examples = [
  {
    center: new Vector2(140, 140),
    shape: new Circle(42)
  },
  {
    center: new Vector2(380, 140),
    shape: new Ellipse(58, 34)
  },
  {
    center: new Vector2(620, 140),
    shape: new Capsule(24, 46)
  },
  {
    center: new Vector2(860, 140),
    shape: new Rectangle(54, 30)
  },
  {
    center: new Vector2(140, 400),
    shape: new Triangle(56, 42, 0.35)
  },
  {
    center: new Vector2(380, 400),
    shape: ConvexPolygon.fromPoints([
      new Vector2(-48, -18),
      new Vector2(-8, -52),
      new Vector2(52, -12),
      new Vector2(26, 44),
      new Vector2(-38, 32)
    ])
  },
  {
    center: new Vector2(620, 400),
    shape: new Line2(62)
  }
]

const canvas2d = new Canvas2D()
canvas2d.start(drawScene)

/**
 * @param {Gizmo2D} gizmo
 * @param {number} time
 */
function drawScene(gizmo, time) {
  gizmo.reset()

  for (let i = 0; i < examples.length; i++) {
    const entry = examples[i]
    const angle = time * ROTATION_SPEED + i * 0.35
    const rotation = Rotary.fromAngle(angle)
    const transform = getShapeTransform(entry.shape, entry.center, rotation)

    gizmo
      .setTransform(new Affine2().rotate(rotation).translate(entry.center))
      .axes(AXIS_LENGTH)
      .reset()

    gizmo.setTransform(transform)
    drawShape(gizmo, entry.shape)
    gizmo.reset()

    drawBoundingCircle(gizmo, entry.shape, transform)
  }
}

/**
 * @param {Gizmo2D} gizmo
 * @param {Circle | Ellipse | Capsule | Rectangle | Triangle | ConvexPolygon | Line2} shape
 */
function drawShape(gizmo, shape) {
  if (shape instanceof Circle) {
    gizmo.circle(shape.radius, SHAPE_COLOR)
    return
  }

  if (shape instanceof Ellipse) {
    gizmo.ellipse(shape.radiusX, shape.radiusY, SHAPE_COLOR)
    return
  }

  if (shape instanceof Capsule) {
    gizmo.capsule(shape.radius, shape.halfHeight, SHAPE_COLOR)
    return
  }

  if (shape instanceof Line2) {
    gizmo.line(
      new Vector2(-shape.halfLength, 0),
      new Vector2(shape.halfLength, 0),
      SHAPE_COLOR
    )
    return
  }

  gizmo.lineStrip(shape.getPoints(), SHAPE_COLOR)
}

/**
 * @param {Gizmo2D} gizmo
 * @param {Circle | Ellipse | Capsule | Rectangle | Triangle | ConvexPolygon | Line2} shape
 * @param {Affine2} transform
 */
function drawBoundingCircle(gizmo, shape, transform) {
  const bounds = shape.boundingCircle()
  bounds.transform(transform)

  gizmo
    .setTransform(new Affine2().translate(bounds.position))
    .circle(bounds.radius, BOUNDS_COLOR, BOUNDS_RESOLUTION)
    .reset()
}

/**
 * @param {Circle | Ellipse | Capsule | Rectangle | Triangle | ConvexPolygon | Line2} shape
 */
function getShapeCenter(shape) {
  const bounds = shape.aabb2d()

  return new Vector2(
    (bounds.min.x + bounds.max.x) * 0.5,
    (bounds.min.y + bounds.max.y) * 0.5
  )
}

/**
 * @param {Circle | Ellipse | Capsule | Rectangle | Triangle | ConvexPolygon | Line2} shape
 * @param {Vector2} center
 * @param {import('hisabati').Rotary} rotation
 */
function getShapeTransform(shape, center, rotation) {
  const pivot = getShapeCenter(shape)

  return new Affine2()
    .translate(new Vector2(-pivot.x, -pivot.y))
    .rotate(rotation)
    .translate(center)
}
