import { Affine2, Vector2 } from 'hisabati'
import type { Contact2D } from '../../../core/contact'
import type { SupportMapped2d } from '../../../core/clipping'
import { buildContactsFromFeatures, getPolygonFeature, type Feature } from '../../../core/clipping'
import { SATStructure, sat2d, sat2dSupportMap } from '../../../core'

export function satContact2d(
  verticesA: Vector2[],
  verticesB: Vector2[],
  axes: Vector2[],
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const results = sat2d(verticesA, verticesB, axes)
  if (!results) return undefined

  const position = new Vector2(transform.x, transform.y)
  const contacts = getContacts(verticesA, verticesB, results, position)

  if (contacts) {
    contacts.forEach((contact) => {
      Affine2.transform(invTransform, contact.pointB, contact.pointB)
      contact.normalB = Affine2.transformWithoutTranslation(invTransform, contact.normalB)
      Vector2.normal(contact.normalA, contact.tangentA)
      Vector2.normal(contact.normalB, contact.tangentB)
    })
  }

  return contacts
}

export function getContacts(
  verticesA: Vector2[],
  verticesB: Vector2[],
  results: SATStructure,
  position: Vector2
): Contact2D[] | undefined {
  let axis = results.axis.clone()
  if (axis.dot(position) < 0) axis = axis.reverse()

  const featureA = getPolygonFeature(verticesA, axis)
  const featureB = getPolygonFeature(verticesB, axis.clone().reverse())
  const contacts = buildContactsFromFeatures(featureA, featureB, axis, results.overlap, 0)
  return contacts.length ? contacts : undefined
}

export function getFeatureContacts(
  featureA: Feature,
  featureB: Feature,
  results: SATStructure,
  position: Vector2
): Contact2D[] | undefined {
  let axis = results.axis.clone()
  if (axis.dot(position) < 0) axis = axis.reverse()

  const contacts = buildContactsFromFeatures(featureA, featureB, axis, results.overlap, 0)
  return contacts.length ? contacts : undefined
}

export function satSupportMapContact2d(
  shape: SupportMapped2d,
  vertices: Vector2[],
  axes: Vector2[],
  transform: Affine2,
  invTransform: Affine2
): Contact2D[] | undefined {
  const position = new Vector2(transform.x, transform.y)
  const results = sat2dSupportMap(shape, vertices, axes)
  if (!results) return undefined

  const axis = results.axis.dot(position) < 0
    ? results.axis.clone().reverse()
    : results.axis.clone()
  const contacts = getFeatureContacts(
    shape.getFeature2d(axis),
    getPolygonFeature(vertices, axis.clone().reverse()),
    results,
    position
  )

  if (contacts) {
    contacts.forEach((contact) => {
      Affine2.transform(invTransform, contact.pointB, contact.pointB)
      contact.normalB = Affine2.transformWithoutTranslation(invTransform, contact.normalB)
      Vector2.normal(contact.normalA, contact.tangentA)
      Vector2.normal(contact.normalB, contact.tangentB)
    })
  }

  return contacts
}

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
