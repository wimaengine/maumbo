import test from "node:test"
import { strictEqual } from "node:assert"
import { Vector3 } from "hisabati"
import { Segment3D } from "../../dist/index.module.js"

test("Segment3D: constructor preserves start and end ordering", () => {
  const segment = new Segment3D(1, 2, 3, 4, 5, 6)

  strictEqual(segment.start.x, 1)
  strictEqual(segment.start.y, 2)
  strictEqual(segment.start.z, 3)
  strictEqual(segment.end.x, 4)
  strictEqual(segment.end.y, 5)
  strictEqual(segment.end.z, 6)
})

test("Segment3D: instance translate mutates and returns itself", () => {
  const segment = new Segment3D(1, 2, 3, 4, 5, 6)
  const translated = segment.translate(new Vector3(7, 8, 9))

  strictEqual(translated, segment)
  strictEqual(segment.start.x, 8)
  strictEqual(segment.start.y, 10)
  strictEqual(segment.start.z, 12)
  strictEqual(segment.end.x, 11)
  strictEqual(segment.end.y, 13)
  strictEqual(segment.end.z, 15)
})

test("Segment3D: clone creates a deep copy", () => {
  const segment = new Segment3D(1, 2, 3, 4, 5, 6)
  const clone = segment.clone()

  strictEqual(clone === segment, false)
  strictEqual(clone.start === segment.start, false)
  strictEqual(clone.end === segment.end, false)
  strictEqual(clone.start.x, 1)
  strictEqual(clone.start.y, 2)
  strictEqual(clone.start.z, 3)
  strictEqual(clone.end.x, 4)
  strictEqual(clone.end.y, 5)
  strictEqual(clone.end.z, 6)
})

test("Segment3D: instance copy overwrites the target", () => {
  const source = new Segment3D(1, 2, 3, 4, 5, 6)
  const target = new Segment3D()

  target.copy(source)

  strictEqual(target.start.x, 1)
  strictEqual(target.start.y, 2)
  strictEqual(target.start.z, 3)
  strictEqual(target.end.x, 4)
  strictEqual(target.end.y, 5)
  strictEqual(target.end.z, 6)
})

test("Segment3D: static copy supports an explicit output", () => {
  const source = new Segment3D(1, 2, 3, 4, 5, 6)
  const out = new Segment3D()
  const result = Segment3D.copy(source, out)

  strictEqual(result, out)
  strictEqual(out.start.x, 1)
  strictEqual(out.start.y, 2)
  strictEqual(out.start.z, 3)
  strictEqual(out.end.x, 4)
  strictEqual(out.end.y, 5)
  strictEqual(out.end.z, 6)
})

test("Segment3D: static translate supports an explicit output", () => {
  const source = new Segment3D(1, 2, 3, 4, 5, 6)
  const out = new Segment3D()
  const result = Segment3D.translate(source, new Vector3(7, 8, 9), out)

  strictEqual(result, out)
  strictEqual(out.start.x, 8)
  strictEqual(out.start.y, 10)
  strictEqual(out.start.z, 12)
  strictEqual(out.end.x, 11)
  strictEqual(out.end.y, 13)
  strictEqual(out.end.z, 15)
})
