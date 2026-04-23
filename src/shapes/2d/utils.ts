import { Vector2 } from 'hisabati'
import type { Feature } from '../../core/gjkEPA.js'

export function getPolygonFeature(vertices: Vector2[], direction: Vector2): Feature {
  const centroid = getPolygonCentroid(vertices)
  let best = createPolygonEdge(vertices, 0, centroid)
  let bestDot = Vector2.dot(best.normal, direction)

  for (let i = 1; i < vertices.length; i++) {
    const edge = createPolygonEdge(vertices, i, centroid)
    const projection = Vector2.dot(edge.normal, direction)

    if (projection > bestDot) {
      best = edge
      bestDot = projection
    }
  }

  return best
}

function createPolygonEdge(
  vertices: Vector2[],
  index: number,
  centroid: Vector2
): Extract<Feature, { type: 'edge' }> {
  const v1 = vertices[index]
  const v2 = vertices[(index + 1) % vertices.length]
  const edge = Vector2.subtract(v2, v1)
  let normal = new Vector2(edge.y, -edge.x).normalize()
  const midpoint = Vector2.add(v1, v2).multiplyScalar(0.5)

  if (Vector2.dot(normal, Vector2.subtract(centroid, midpoint)) > 0) {
    normal = normal.reverse()
  }

  return {
    type: 'edge',
    v1: v1.clone(),
    v2: v2.clone(),
    normal
  }
}

function getPolygonCentroid(vertices: Vector2[]): Vector2 {
  const centroid = new Vector2()

  for (let i = 0; i < vertices.length; i++) {
    centroid.add(vertices[i])
  }

  return centroid.multiplyScalar(1 / vertices.length)
}
