import { Shape2 } from './shape2.js'
import { Vector2 } from 'hisabati'

export class Rectangle extends Shape2 {
  halfWidth = 0
  halfHeight = 0

  constructor(halfWidth: number, halfHeight: number) {
    super()
    this.halfWidth = halfWidth
    this.halfHeight = halfHeight
  }

  getPoints(): Vector2[] {
    const { halfWidth, halfHeight } = this
    const positions = [
      new Vector2(-halfWidth, -halfHeight),
      new Vector2(halfWidth, -halfHeight),
      new Vector2(halfWidth, halfHeight),
      new Vector2(-halfWidth, halfHeight)
    ]
    
    return positions
  }
}
