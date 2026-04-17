import { Vector2 } from 'hisabati'

/**
 * @param {Vector2} position
 * @param {Vector2[]} vertices
 */
export function getNearVertex(position: Vector2, vertices: Vector2[]): number {
  let vertex = 0
  let min = Infinity
  
  for (let i = 0; i < vertices.length; i++) {
    const a = Vector2.distanceToSquared(vertices[i], position)
    
    if (min > a) {
      vertex = i
      min = a
    }
  }
  
  return vertex
}
