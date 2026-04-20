import test from "node:test"
import { ok, strictEqual } from "node:assert"
import { Vector2, fuzzyEqual } from "hisabati"
import { Contact2D, getContacts } from "../../dist/index.module.js"

test("getContacts: returns 2 contacts for simple square overlap", () => {
  const pointsA = [
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ]

  const pointsB = [
    new Vector2(-1, -1),
    new Vector2(1, -1),
    new Vector2(1, 1),
    new Vector2(-1, 1),
  ].map((p) => new Vector2(p.x + 1.5, p.y))

  const axis = new Vector2(1, 0)
  const position = new Vector2(1.5, 0)

  const contacts = getContacts(pointsA, pointsB, { axis }, position)
  ok(Array.isArray(contacts))
  strictEqual(contacts.length, 2)
  contacts.forEach((c) => {
    strictEqual(c instanceof Contact2D, true)
    strictEqual(fuzzyEqual(Math.abs(c.normalA.x), 1, 1e-6), true)
    strictEqual(fuzzyEqual(Math.abs(c.normalA.y), 0, 1e-6), true)
    strictEqual(fuzzyEqual(Math.abs(c.depth), 0.5, 1e-6), true)
  })
})
