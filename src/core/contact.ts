import { Affine2, Vector2 } from 'hisabati'

export class Contact2D {
  pointA = new Vector2()
  pointB = new Vector2()
  normalA = new Vector2()
  normalB = new Vector2()
  depth = 0
  tangentA = new Vector2()
  tangentB = new Vector2()

  constructor(
    pointA: Vector2,
    pointB: Vector2,
    normalA: Vector2,
    normalB: Vector2,
    depth: number,
    tangentA: Vector2,
    tangentB: Vector2
  ) {
    this.pointA = pointA
    this.pointB = pointB
    this.normalA = normalA
    this.normalB = normalB
    this.depth = depth
    this.tangentA = tangentA
    this.tangentB = tangentB
  }

  clone(): Contact2D {
    return new Contact2D(
      this.pointA,
      this.pointB,
      this.normalA,
      this.normalB,
      this.depth,
      this.tangentA,
      this.tangentB
    )
  }

  transform(transformA: Affine2, transformB: Affine2): this {
    transformA.transform(this.pointA)
    transformB.transform(this.pointB)
    this.normalA = Affine2.transformWithoutTranslation(transformA, this.normalA)
    this.normalB = Affine2.transformWithoutTranslation(transformB, this.normalB)
    this.tangentA = Affine2.transformWithoutTranslation(transformA, this.tangentA)
    this.tangentB = Affine2.transformWithoutTranslation(transformB, this.tangentB)
    return this
  }

  flip(): this {
    const { pointA, normalA, tangentA } = this

    this.pointA = this.pointB
    this.pointB = pointA
    this.normalA = this.normalB
    this.normalB = normalA
    this.tangentA = this.tangentB
    this.tangentB = tangentA

    return this
  }
}
