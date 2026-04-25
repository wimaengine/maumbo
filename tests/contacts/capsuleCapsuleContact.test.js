import test from "node:test"
import { strictEqual } from "node:assert"
import { Affine2, fuzzyEqual } from "hisabati"
import { Capsule, capsuleContacts } from "../../dist/index.module.js"

test("capsuleContacts: returns two contacts for parallel overlapping capsule edges", () => {
  const capsuleA = new Capsule(1, 2)
  const capsuleB = new Capsule(1, 2)
  const transform = Affine2.identity()
  transform.x = 1.5
  const invTransform = Affine2.copy(transform).invert()

  const contacts = capsuleContacts(capsuleA, capsuleB, transform, invTransform)

  strictEqual(Array.isArray(contacts), true)
  strictEqual(contacts.length, 2)

  const ordered = [...contacts].sort((a, b) => a.pointA.y - b.pointA.y)

  strictEqual(fuzzyEqual(ordered[0].pointA.x, 1, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[1].pointA.x, 1, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[0].pointA.y, -2, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[1].pointA.y, 2, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[0].pointB.x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[1].pointB.x, -1, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[0].pointB.y, -2, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[1].pointB.y, 2, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[0].depth, 0.5, 1e-8), true)
  strictEqual(fuzzyEqual(ordered[1].depth, 0.5, 1e-8), true)
})
