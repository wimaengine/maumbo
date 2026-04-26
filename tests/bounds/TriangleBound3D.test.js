import test from "node:test"
import { strictEqual } from "node:assert"
import { Vector3 } from "hisabati"
import { TriangleBound3D } from "../../dist/index.module.js"

test("TriangleBound3D: constructor stores the provided vertices", () => {
  const a = new Vector3(1, 2, 3)
  const b = new Vector3(4, 5, 6)
  const c = new Vector3(7, 8, 9)
  const triangle = new TriangleBound3D(a, b, c)

  strictEqual(triangle.a, a)
  strictEqual(triangle.b, b)
  strictEqual(triangle.c, c)
})

test("TriangleBound3D: instance translate mutates and returns itself", () => {
  const triangle = new TriangleBound3D(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6),
    new Vector3(7, 8, 9)
  )
  const translated = triangle.translate(10, 20, 30)

  strictEqual(translated, triangle)
  strictEqual(triangle.a.x, 11)
  strictEqual(triangle.a.y, 22)
  strictEqual(triangle.a.z, 33)
  strictEqual(triangle.b.x, 14)
  strictEqual(triangle.b.y, 25)
  strictEqual(triangle.b.z, 36)
  strictEqual(triangle.c.x, 17)
  strictEqual(triangle.c.y, 28)
  strictEqual(triangle.c.z, 39)
})

test("TriangleBound3D: clone creates a deep copy", () => {
  const triangle = new TriangleBound3D(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6),
    new Vector3(7, 8, 9)
  )
  const clone = triangle.clone()

  strictEqual(clone === triangle, false)
  strictEqual(clone.a === triangle.a, false)
  strictEqual(clone.b === triangle.b, false)
  strictEqual(clone.c === triangle.c, false)
  strictEqual(clone.a.x, 1)
  strictEqual(clone.a.y, 2)
  strictEqual(clone.a.z, 3)
  strictEqual(clone.b.x, 4)
  strictEqual(clone.b.y, 5)
  strictEqual(clone.b.z, 6)
  strictEqual(clone.c.x, 7)
  strictEqual(clone.c.y, 8)
  strictEqual(clone.c.z, 9)
})

test("TriangleBound3D: instance copy overwrites all vertices", () => {
  const source = new TriangleBound3D(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6),
    new Vector3(7, 8, 9)
  )
  const target = new TriangleBound3D()

  target.copy(source)

  strictEqual(target.a.x, 1)
  strictEqual(target.a.y, 2)
  strictEqual(target.a.z, 3)
  strictEqual(target.b.x, 4)
  strictEqual(target.b.y, 5)
  strictEqual(target.b.z, 6)
  strictEqual(target.c.x, 7)
  strictEqual(target.c.y, 8)
  strictEqual(target.c.z, 9)
})

test("TriangleBound3D: static copy supports an explicit output", () => {
  const source = new TriangleBound3D(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6),
    new Vector3(7, 8, 9)
  )
  const out = new TriangleBound3D()
  const result = TriangleBound3D.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.a.x, 1)
  strictEqual(out.a.y, 2)
  strictEqual(out.a.z, 3)
  strictEqual(out.b.x, 4)
  strictEqual(out.b.y, 5)
  strictEqual(out.b.z, 6)
  strictEqual(out.c.x, 7)
  strictEqual(out.c.y, 8)
  strictEqual(out.c.z, 9)
})

test("TriangleBound3D: static translate supports an explicit output", () => {
  const source = new TriangleBound3D(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6),
    new Vector3(7, 8, 9)
  )
  const out = new TriangleBound3D()
  const result = TriangleBound3D.translate(source, 10, 20, 30, out)

  strictEqual(result, out)
  strictEqual(out.a.x, 11)
  strictEqual(out.a.y, 22)
  strictEqual(out.a.z, 33)
  strictEqual(out.b.x, 14)
  strictEqual(out.b.y, 25)
  strictEqual(out.b.z, 36)
  strictEqual(out.c.x, 17)
  strictEqual(out.c.y, 28)
  strictEqual(out.c.z, 39)
})
