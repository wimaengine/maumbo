import { Affine2, Rotary, TAU, Vector2 } from 'hisabati'
import { Capsule, Circle, ConvexPolygon, Ellipse, GJK2d, Line2, Rectangle, Triangle } from 'maumbo'
import { Canvas2D, Gizmo2D } from '@examples/utils'
import { Color } from 'marangi'
import { GUI } from 'dat.gui'

const settings = {
  shapeA: 'Circle',
  shapeB: 'Rectangle',
  resolution: 24,
  separation: 55,
  rotationA: 0,
  rotationB: 0,
  showSamples: true
}

const palette = {
  ink: new Color(0.82, 0.86, 0.91, 1),
  muted: new Color(0.32, 0.38, 0.46, 1),
  cyan: new Color(0.18, 0.86, 0.94, 1),
  orange: new Color(1, 0.48, 0.22, 1),
  violet: new Color(0.66, 0.48, 1, 1)
}

const canvas2d = new Canvas2D()
const gui = new GUI({ name: 'GJK controls' })
gui.add(settings, 'shapeA', ['Circle', 'Ellipse', 'Rectangle', 'Triangle', 'Capsule', 'Line2', 'Hexagon'])
gui.add(settings, 'shapeB', ['Circle', 'Ellipse', 'Rectangle', 'Triangle', 'Capsule', 'Line2', 'Hexagon'])
gui.add(settings, 'resolution', 6, 64, 1).name('Minkowski resolution')
gui.add(settings, 'separation', 40, 130, 1).name('separation')
gui.add(settings, 'rotationA', -Math.PI, Math.PI, 0.01).name('A rotation')
gui.add(settings, 'rotationB', -Math.PI, Math.PI, 0.01).name('B rotation')
gui.add(settings, 'showSamples').name('Minkowski samples')

/**
 * @import { Shape2 } from 'maumbo'
 */

/**
 * @param {string} name
 * @returns {Shape2}
 */
function createShape(name) {
  if (name === 'Circle') return new Circle(34)
  if (name === 'Ellipse') return new Ellipse(43, 27)
  if (name === 'Rectangle') return new Rectangle(37, 28)
  if (name === 'Triangle') return new Triangle(40, 34, -0.2)
  if (name === 'Capsule') return new Capsule(18, 28)
  if (name === 'Line2') return new Line2(42)
  const points = []
  for (let i = 0; i < 6; i++) points.push(Vector2.fromAngle(TAU * i / 6).multiplyScalar(38))
  return ConvexPolygon.fromPoints(points)
}

/**
 * @param {Shape2} shape
 * @param {number} resolution
 */
function pointsOf(shape, resolution) {
  if (shape instanceof Circle || shape instanceof Ellipse || shape instanceof Capsule) return shape.getPoints(resolution)
  if (shape instanceof Line2) return [new Vector2(-shape.halfLength, 0), new Vector2(shape.halfLength, 0)]
  return shape.getPoints()
}

/**
 * @param {Shape2} shape
 * @param {Affine2} transform
 * @param {Affine2} inverse
 * @param {Vector2} direction
 */
function transformSupport(shape, transform, inverse, direction) {
  const localDirection = Affine2.transformWithoutTranslation(inverse, direction.clone().reverse())
  return Affine2.transform(transform, shape.getSupportPoint2d(localDirection))
}

/**
 * @param {Gizmo2D} gizmo
 * @param {Shape2} shape
 * @param {Affine2} transform
 * @param {Color} color
 * @param {number} resolution
 */
function drawShape(gizmo, shape, transform, color, resolution) {
  const points = pointsOf(shape, resolution).map(
    /**
     * @param {Vector2} point
     */
    (point) => Affine2.transform(transform, point)
  )
  gizmo
    .lineStrip(points, color, !(shape instanceof Line2))
    .reset()
}

/**
 * @param {Gizmo2D} gizmo
 * @param {Vector2} center
 * @param {number} width
 * @param {number} height
 */
function drawPanel(gizmo, center, width, height) {
  gizmo
    .reset()
    .line(
      new Vector2(center.x - width, center.y),
      new Vector2(center.x + width, center.y),
      palette.muted
    )
    .line(
      new Vector2(center.x, center.y - height),
      new Vector2(center.x, center.y + height),
      palette.muted
    )
    .reset()
}

/**
 * @param {Gizmo2D} gizmo
 */
function drawScene(gizmo) {
  const shapeA = createShape(settings.shapeA)
  const shapeB = createShape(settings.shapeB)
  const transformA = Affine2.compose(
    Vector2.Zero,
    Rotary.fromAngle(settings.rotationA),
    new Vector2(1, 1)
  )
  const worldTransformB = Affine2.compose(
    new Vector2(settings.separation, 0),
    Rotary.fromAngle(settings.rotationB),
    new Vector2(1, 1)
  )
  const inverseA = transformA.clone().invert()
  const transformB = Affine2.multiply(inverseA, worldTransformB, new Affine2())
  const inverse = transformB.clone().invert()
  const width = canvas2d.width
  const height = canvas2d.height
  const left = new Vector2(width * 0.27, height * 0.52)
  const right = new Vector2(width * 0.73, height * 0.52)
  const scale = Math.min(width / 900, height / 650, 1)
  const panelW = 210 / scale
  const panelH = 190 / scale

  drawPanel(gizmo, left, panelW, panelH)
  drawPanel(gizmo, right, panelW, panelH)

  const samples = []
  const count = Math.max(6, Math.floor(settings.resolution))
  for (let i = 0; i < count; i++) {
    const direction = Vector2.fromAngle(TAU * i / count)
    const pointA = shapeA.getSupportPoint2d(direction)
    const pointB = transformSupport(shapeB, transformB, inverse, direction)
    samples.push({ point: Vector2.subtract(pointA, pointB) })
  }

  const simplex = GJK2d(shapeA, shapeB, transformB, inverse, Vector2.X)

  if (settings.showSamples) {
    gizmo
      .reset()
      .lineStrip(
        samples.map(({ point }) => Vector2.add(Affine2.transform(transformA, point), left)),
        palette.violet
      )
  }

  if (simplex?.length) {
    const simplexPoints = simplex.map(({ point }) => Vector2.add(Affine2.transform(transformA, point), left))
    gizmo
      .reset()
      .lineStrip(simplexPoints, palette.orange, simplex.length === 3)

    simplexPoints.forEach((point) => {
      gizmo
        .reset()
        .translate(point.x, point.y)
        .circle(5, palette.orange, 10)
        .reset()
    })
  }

  const renderTransformA = Affine2.multiply(new Affine2().translate(right), transformA, new Affine2())
  const renderTransformB = Affine2.multiply(new Affine2().translate(right), worldTransformB, new Affine2())
  drawShape(gizmo, shapeA, renderTransformA, palette.cyan, settings.resolution)
  drawShape(gizmo, shapeB, renderTransformB, palette.orange, settings.resolution)
}

canvas2d.gridEnabled = false
canvas2d.start(drawScene)
