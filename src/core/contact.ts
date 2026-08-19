import { Affine2, Vector2 } from 'hisabati'

export class Contact2D {
  pointA
  pointB
  normalA
  normalB
  depth = 0
  tangentA = new Vector2()
  tangentB = new Vector2()

  constructor(
    pointA: Vector2,
    pointB: Vector2,
    normalA: Vector2,
    normalB: Vector2,
    depth: number
  ) {
    this.pointA = pointA
    this.pointB = pointB
    this.normalA = normalA
    this.normalB = normalB
    this.depth = depth
    this.updateTangents()
  }

  clone(): Contact2D {
    return new Contact2D(
      this.pointA.clone(),
      this.pointB.clone(),
      this.normalA.clone(),
      this.normalB.clone(),
      this.depth
    )
  }

  transform(transformA: Affine2, transformB: Affine2): this {
    Affine2.transform(transformA, this.pointA, this.pointA)
    Affine2.transform(transformB, this.pointB, this.pointB)
    Affine2.transformWithoutTranslation(transformA, this.normalA, this.normalA)
    Affine2.transformWithoutTranslation(transformB, this.normalB, this.normalB)
    this.updateTangents()
    return this
  }

  flip(): this {
    const { pointA, normalA } = this

    this.pointA = this.pointB
    this.pointB = pointA
    this.normalA = this.normalB
    this.normalB = normalA
    this.updateTangents()

    return this
  }

  private updateTangents(): void {
    Vector2.normal(this.normalA, this.tangentA)
    Vector2.normal(this.normalB, this.tangentB)
  }
}
