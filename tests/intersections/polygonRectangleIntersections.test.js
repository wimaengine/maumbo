import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, Rotary, Vector2 } from "hisabati"
import { ConvexPolygon, polygonRectangleIntersections, Rectangle } from "../../dist/index.module.js"

test("polygonRectangleIntersections: returns undefined when the shapes are disjoint", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const rectangle = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = -3
  transform.y = -3

  strictEqual(polygonRectangleIntersections(polygon, rectangle, transform, Affine2.copy(transform).invert()), undefined)
})

test("polygonRectangleIntersections: returns undefined when one shape contains the other", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-3, -3),
    new Vector2(3, -3),
    new Vector2(4, 1),
    new Vector2(0, 4),
    new Vector2(-4, 1)
  ])
  const rectangle = new Rectangle(0.5, 0.5)
  const transform = Affine2.identity()

  strictEqual(polygonRectangleIntersections(polygon, rectangle, transform, Affine2.copy(transform).invert()), undefined)
})

test("polygonRectangleIntersections: returns one point on a corner touch", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const rectangle = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.x = -2.5
  transform.y = -0.5

  const intersections = polygonRectangleIntersections(polygon, rectangle, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 1)
  strictEqual(intersections[0].points.length, 1)
})

test("polygonRectangleIntersections: returns two points when the rectangle crosses the polygon", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const rectangle = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 4))
  transform.x = -2.5
  transform.y = -0.5

  const intersections = polygonRectangleIntersections(polygon, rectangle, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 2)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 1)
})

test("polygonRectangleIntersections: returns more than two points when the shapes overlap across multiple edges", () => {
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1.5, 0.5),
    new Vector2(0, 1.5),
    new Vector2(-1.5, 0.5)
  ])
  const rectangle = new Rectangle(1, 1)
  const transform = Affine2.identity()
  transform.rotate(Rotary.fromAngle(Math.PI / 2))
  transform.x = -1.5

  const intersections = polygonRectangleIntersections(polygon, rectangle, transform, Affine2.copy(transform).invert())
  strictEqual(intersections.length, 3)
  strictEqual(intersections[0].points.length, 1)
  strictEqual(intersections[1].points.length, 2)
  strictEqual(intersections[2].points.length, 1)
})
