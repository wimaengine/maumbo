import { Shape2 } from './shape2.js'
import { Vector2 } from 'hisabati'

export class Triangle extends Shape2 {
  halfBase = 0
  halfHeight = 0
  baseRatio = 0

  constructor(halfBase: number, halfHeight: number, baseRatio = 0) {
    super()
    this.halfBase = halfBase
    this.halfHeight = halfHeight
    this.baseRatio = baseRatio
  }

  getPoints(): Vector2[] {
    const { baseRatio, halfBase, halfHeight } = this
    const positions = [
      new Vector2(-halfBase, -halfHeight),
      new Vector2(halfBase, -halfHeight),
      new Vector2(halfBase * baseRatio, halfHeight)
    ]
    
    return positions
  }
}
