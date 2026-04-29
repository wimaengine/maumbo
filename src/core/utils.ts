import { Vector2 } from "hisabati"

export function tripleProduct(a: Vector2, b: Vector2, c: Vector2): Vector2 {
  const ac = Vector2.dot(a, c)
  const bc = Vector2.dot(b, c)

  return Vector2.subtract(
    Vector2.multiplyScalar(b, ac),
    Vector2.multiplyScalar(a, bc)
  )
}

export function perpendicularToward(edge: Vector2, toward: Vector2): Vector2 {
  const normal = new Vector2(-edge.y, edge.x)

  if (Vector2.dot(normal, toward) < 0) {
    normal.reverse()
  }

  return normal
}
