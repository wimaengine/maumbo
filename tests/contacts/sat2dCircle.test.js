import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import { Circle, sat2dCircle } from "../../dist/index.module.js"

test("sat2dCircle: returns undefined when separated", () => {
  const circle = new Circle(1)
  const rectPoints = [
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ].map((p) => new Vector2(p.x + 5, p.y))

  const axes = [
    new Vector2(1, 0),
    new Vector2(0, 1),
    new Vector2(0, -1),
  ]
  const transform = Affine2.identity()
  transform.x = 5
  const invTransform = Affine2.copy(transform).invert()

  strictEqual(sat2dCircle(circle, rectPoints, axes, transform, invTransform), undefined)
})

test("sat2dCircle: returns contacts when overlapping", () => {
  const circle = new Circle(1)
  const rectPoints = [
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ].map((p) => new Vector2(p.x + 1.5, p.y))

  const axis = new Vector2(0.5, -1).normalize()
  const axes = [
    axis,
    new Vector2(1, 0),
    new Vector2(0, 1),
  ]
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = sat2dCircle(circle, rectPoints, axes, transform, invTransform)
  ok(Array.isArray(contacts))
  ok(contacts.length > 0)
  contacts.forEach((contact) => ok(contact.depth >= -1e-9))
})
