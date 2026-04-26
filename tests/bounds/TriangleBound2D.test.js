import test from "node:test"
import { strictEqual } from "node:assert"
import { Vector2 } from "hisabati"
import { TriangleBound2D } from "../../dist/index.module.js"

test("TriangleBound2D: constructor stores the provided vertices", () => {
  const a = new Vector2(1, 2)
  const b = new Vector2(3, 4)
  const c = new Vector2(5, 6)
  const triangle = new TriangleBound2D(a, b, c)

  strictEqual(triangle.a, a)
  strictEqual(triangle.b, b)
  strictEqual(triangle.c, c)
})

test("TriangleBound2D: instance translate mutates and returns itself", () => {
  const triangle = new TriangleBound2D(
    new Vector2(1, 2),
    new Vector2(3, 4),
    new Vector2(5, 6)
  )
  const translated = triangle.translate(7, 8)

  strictEqual(translated, triangle)
  strictEqual(triangle.a.x, 8)
  strictEqual(triangle.a.y, 10)
  strictEqual(triangle.b.x, 10)
  strictEqual(triangle.b.y, 12)
  strictEqual(triangle.c.x, 12)
  strictEqual(triangle.c.y, 14)
})

test("TriangleBound2D: clone creates a deep copy", () => {
  const triangle = new TriangleBound2D(
    new Vector2(1, 2),
    new Vector2(3, 4),
    new Vector2(5, 6)
  )
  const clone = triangle.clone()

  strictEqual(clone === triangle, false)
  strictEqual(clone.a === triangle.a, false)
  strictEqual(clone.b === triangle.b, false)
  strictEqual(clone.c === triangle.c, false)
  strictEqual(clone.a.x, 1)
  strictEqual(clone.a.y, 2)
  strictEqual(clone.b.x, 3)
  strictEqual(clone.b.y, 4)
  strictEqual(clone.c.x, 5)
  strictEqual(clone.c.y, 6)
})

test("TriangleBound2D: instance copy overwrites all vertices", () => {
  const source = new TriangleBound2D(
    new Vector2(1, 2),
    new Vector2(3, 4),
    new Vector2(5, 6)
  )
  const target = new TriangleBound2D()

  target.copy(source)

  strictEqual(target.a.x, 1)
  strictEqual(target.a.y, 2)
  strictEqual(target.b.x, 3)
  strictEqual(target.b.y, 4)
  strictEqual(target.c.x, 5)
  strictEqual(target.c.y, 6)
})

test("TriangleBound2D: static copy supports an explicit output", () => {
  const source = new TriangleBound2D(
    new Vector2(1, 2),
    new Vector2(3, 4),
    new Vector2(5, 6)
  )
  const out = new TriangleBound2D()
  const result = TriangleBound2D.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.a.x, 1)
  strictEqual(out.a.y, 2)
  strictEqual(out.b.x, 3)
  strictEqual(out.b.y, 4)
  strictEqual(out.c.x, 5)
  strictEqual(out.c.y, 6)
})

test("TriangleBound2D: static translate supports an explicit output", () => {
  const source = new TriangleBound2D(
    new Vector2(1, 2),
    new Vector2(3, 4),
    new Vector2(5, 6)
  )
  const out = new TriangleBound2D()
  const result = TriangleBound2D.translate(source, 7, 8, out)

  strictEqual(result, out)
  strictEqual(out.a.x, 8)
  strictEqual(out.a.y, 10)
  strictEqual(out.b.x, 10)
  strictEqual(out.b.y, 12)
  strictEqual(out.c.x, 12)
  strictEqual(out.c.y, 14)
})
