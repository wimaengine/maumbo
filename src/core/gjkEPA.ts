import { Affine2, Vector2 } from 'hisabati'
import { Contact2D } from './contact.js'
import {
  buildContactsFromFeatures,
  buildPointPointContact,
  transformFeature2d,
  type SupportMapped2d
} from './clipping.js'
import { GJK2d } from './GJK'
import { EPA2d } from './EPA'

const CONTACT_TOLERANCE = 1e-6

/**
 * Generic convex support-mapped contact manifold helper.
 */
export function GJKandEPA2d(
  shapeA: SupportMapped2d,
  shapeB: SupportMapped2d,
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const simplex = GJK2d(shapeA, shapeB, transform, invTransform, new Vector2(transform.x, transform.y))

  if (!simplex) {
    return undefined
  }

  const epa = EPA2d(simplex, shapeA, shapeB, transform, invTransform, new Vector2(transform.x, transform.y))

  if (!epa) {
    return undefined
  }

  let contacts = buildContactsFromFeatures(
    shapeA.getFeature2d(epa.normal),
    transformFeature2d(
      shapeB.getFeature2d(
        Affine2.transformWithoutTranslation(invTransform, epa.normal.clone().reverse())
      ),
      transform
    ),
    epa.normal,
    epa.depth,
    CONTACT_TOLERANCE
  )

  if (!contacts.length) {
    contacts = buildPointPointContact(
      shapeA.getSupportPoint2d(epa.normal),
      Affine2.transform(
        transform,
        shapeB.getSupportPoint2d(
          Affine2.transformWithoutTranslation(invTransform, epa.normal.clone().reverse())
        )
      ),
      epa.normal,
      epa.depth
    )
  }

  contacts.forEach((contact) => {
    invTransform.transform(contact.pointB)
    contact.normalB = Affine2.transformWithoutTranslation(invTransform, contact.normalB)
    contact.tangentB = Affine2.transformWithoutTranslation(invTransform, contact.tangentB)
  })

  return contacts
}
