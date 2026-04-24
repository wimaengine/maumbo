import test, { describe } from "node:test"
import { deepStrictEqual, ok, strictEqual } from "node:assert"
import { Vector2, Affine2, fuzzyEqual } from "hisabati"
import { SAT2d, Contact2D } from "../dist/index.module.js"

describe("Testing SAT contact point generation", (suite)=>{
  test("Contact on one point", () => {
    const transform = Affine2.identity()
    const pointsA = [
      new Vector2(2, 8),
      new Vector2(6, 4),
      new Vector2(9, 7),
      new Vector2(5, 11),
    ]
    const pointsB = [
      new Vector2(4, 2),
      new Vector2(12, 2),
      new Vector2(12, 5),
      new Vector2(4, 5),
    ]
  
    const axes = [
      Vector2.subtract(pointsA[0], pointsA[1]),
      Vector2.subtract(pointsA[1], pointsA[2]),
      Vector2.subtract(pointsB[0], pointsB[1]),
      Vector2.subtract(pointsB[1], pointsB[2])
    ].map(axis => Vector2.normal(axis).normalize())
  
    const contacts = SAT2d(pointsA, pointsB, axes, transform, transform.invert())
    deepStrictEqual(contacts, [
      new Contact2D(
        new Vector2(6, 4),
        new Vector2(6, 5),
        new Vector2(-0, -1),
        new Vector2(0, 1),
        1,
        new Vector2(1, -0),
        new Vector2(1, -0)
      )])
  })
  test("Contact on two points case 1", () => {
    const transform = Affine2.identity()
    const pointsA = [
      new Vector2(8, 4),
      new Vector2(14, 4),
      new Vector2(14, 9),
      new Vector2(8, 9),
    ]
    const pointsB = [
      new Vector2(4, 2),
      new Vector2(12, 2),
      new Vector2(12, 5),
      new Vector2(4, 5),
    ]
  
    const axes = [
      Vector2.subtract(pointsA[0], pointsA[1]),
      Vector2.subtract(pointsA[1], pointsA[2]),
      Vector2.subtract(pointsB[0], pointsB[1]),
      Vector2.subtract(pointsB[1], pointsB[2])
    ].map(axis => Vector2.normal(axis).normalize())
  
    const contacts = SAT2d(pointsA, pointsB, axes, transform, transform.invert())
    deepStrictEqual(contacts, [
      new Contact2D(
        new Vector2(12, 4),
        new Vector2(12, 5),
        new Vector2(0, -1),
        new Vector2(-0, 1),
        1,
        new Vector2(-1, -0),
        new Vector2(-1, 0)
      ),
      new Contact2D(
        new Vector2(8, 4),
        new Vector2(8, 5),
        new Vector2(0, -1),
        new Vector2(-0, 1),
        1,
        new Vector2(-1, -0),
        new Vector2(-1, 0)
      )
    ])
  })
  
  test("Contact on two points case 2", () => {
    const transform = Affine2.identity()
    const pointsA = [
      new Vector2(9, 4),
      new Vector2(13, 3),
      new Vector2(14, 7),
      new Vector2(10, 8),
    ]
    const pointsB = [
      new Vector2(4, 2),
      new Vector2(12, 2),
      new Vector2(12, 5),
      new Vector2(4, 5),
    ]
  
    const axes = [
      Vector2.subtract(pointsA[0], pointsA[1]),
      Vector2.subtract(pointsA[1], pointsA[2]),
      Vector2.subtract(pointsB[0], pointsB[1]),
      Vector2.subtract(pointsB[1], pointsB[2])
    ].map(axis => Vector2.normal(axis).normalize())
  
    const contacts = SAT2d(pointsA, pointsB, axes, transform, transform.invert())
    deepStrictEqual(contacts[0].pointA, new Vector2(11.588235294117647, 3.3529411764705883))
    deepStrictEqual(contacts[0].pointB, new Vector2(12, 5))
    ok(fuzzyEqual(contacts[0].normalA.x, -0.24253562503633297))
    ok(fuzzyEqual(contacts[0].normalA.y, -0.9701425001453319))
    ok(fuzzyEqual(contacts[0].normalB.x, 0.24253562503633297))
    ok(fuzzyEqual(contacts[0].normalB.y, 0.9701425001453319))
    strictEqual(contacts[0].depth, 1.6977493752543307)
  
    deepStrictEqual(contacts[1].pointA, new Vector2(9, 4))
    deepStrictEqual(contacts[1].pointB, new Vector2(9.25, 5))
    ok(fuzzyEqual(contacts[1].normalA.x, -0.24253562503633297))
    ok(fuzzyEqual(contacts[1].normalA.y, -0.9701425001453319))
    ok(fuzzyEqual(contacts[1].normalB.x, 0.24253562503633297))
    ok(fuzzyEqual(contacts[1].normalB.y, 0.9701425001453319))
    strictEqual(contacts[1].depth, 1.0307764064044154)
  })
})
