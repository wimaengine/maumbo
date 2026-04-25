import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Affine2, Vector2 } from "hisabati"
import {
  Capsule,
  Contact2D,
  ConvexPolygon,
  capsuleConvexPolygonContact
} from "../../dist/index.module.js"

test("capsuleConvexPolygonContact: returns a cap contact against a polygon", () => {
  const capsule = new Capsule(1, 2)
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1)
  ])
  const transform = Affine2.identity()
  transform.y = 2.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = capsuleConvexPolygonContact(capsule, polygon, transform, invTransform)

  ok(Array.isArray(contacts))
  ok(contacts.length >= 1)
  contacts.forEach((contact) => {
    ok(contact instanceof Contact2D)
    ok(contact.depth > 0)
    ok(contact.pointA.y >= 2)
  })
})

test("capsuleConvexPolygonContact: keeps a single manifold point on a rounded cap", () => {
  const capsule = new Capsule(1, 2)
  const polygon = ConvexPolygon.fromPoints([
    new Vector2(-1.2, -0.8),
    new Vector2(1.4, -1.0),
    new Vector2(1.8, 0.7),
    new Vector2(-0.8, 1.1)
  ])
  const transform = Affine2.identity()
  transform.x = -2.5
  transform.y = -2.9
  const invTransform = Affine2.copy(transform).invert()

  const contacts = capsuleConvexPolygonContact(capsule, polygon, transform, invTransform)

  ok(Array.isArray(contacts))
  strictEqual(contacts.length, 1)
  ok(contacts[0] instanceof Contact2D)
  ok(contacts[0].depth > 0)
  ok(contacts[0].pointA.y < -2)
})
