import { Shape2 } from './shape2.js'

export class Line2 extends Shape2 {
  halfLength = 0

  constructor(halfLength: number) {
    super()
    this.halfLength = halfLength
  }
}
