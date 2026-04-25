import {Affine2, Affine3, Rotary, TAU, Vector2, Vector3, BVector2 } from 'hisabati'
import { Color } from 'marangi'

/**
 * @template T
 */
export class GizmoBuffer {

  /**
   * @type {T[]}
   */
  positions = []

  /**
   * @type {Color[]}
   */
  colors = []

  /**
   * @type {T[]}
   */
  stripPositions = []

  /**
   * @type {Color[]}
   */
  stripColors = []
  clear() {
    this.positions.length = 0
    this.colors.length = 0
    this.stripPositions.length = 0
    this.stripColors.length = 0
  }
}
export class Gizmo2D {

  /**
   * @private
   * @type {Affine2}
   */
  transformation = new Affine2()

  /**
   * @type {GizmoBuffer<Vector2>}
   */
  buffer = new GizmoBuffer()

  constructor() {
  }

  /**
   * @returns {this}
   */
  reset() {
    Affine2.identity(this.transformation)

    return this
  }

  /**
   * @param {Affine2} matrix
   */
  setTransform(matrix) {
    this.transformation.copy(matrix)
    return this
  }

  /**
   * @param {Affine2} matrix
   * @returns {this}
   */
  transform(matrix) {
    this.transformation.multiply(matrix)

    return this
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  translate(x, y) {
    this.transformation.translate(new Vector2(x, y))

    return this
  }

  /**
   * @param {number} angle
   * @returns {this}
   */
  rotate(angle) {
    this.transformation.rotate(Rotary.fromAngle(angle))

    return this
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  scale(x, y) {
    this.transformation.scale(new Vector2(x, y))

    return this
  }

  /**
   * @param {Vector2} start
   * @param {Vector2} end
   * @param {Color} color
   * @returns
   */
  line(
    start = Vector2.Zero.clone(),
    end = Vector2.X.clone(),
    color = Color.WHITE
  ) {
    this.lineGradient(start, end, color, color)

    return this
  }

  /**
   * @param {Vector2} start
   * @param {Vector2} end
   * @param {Color} colorStart
   * @param {Color} colorEnd
   * @returns {this}
   */
  lineGradient(start, end, colorStart, colorEnd) {
    this.buffer.positions.push(
      this.transformation.transform(start),
      this.transformation.transform(end)
    )
    this.buffer.colors.push(colorStart, colorEnd)

    return this
  }

  /**
   * @param {Vector2[]} strips
   * @param {Color} color
   * @returns {this}
   */
  lineStrip(strips, color, closed = true) {
    for (let i = 0; i < strips.length; i++) {
      this.buffer.stripPositions.push(Affine2.transform(this.transformation,strips[i]))
      this.buffer.stripColors.push(color)
    }

    if(strips[0] && closed){
      this.buffer.stripPositions.push(Affine2.transform(this.transformation,strips[0]))
      this.buffer.stripColors.push(color)
    }

    this.buffer.stripPositions.push(new Vector2(NaN, NaN))
    this.buffer.stripColors.push(new Color(NaN, NaN, NaN, NaN))

    return this
  }

  /**
   * @param {[Vector2,Color][]} strips
   * @returns {this}
   */
  lineStripGradient(strips) {
    for (let i = 0; i < strips.length; i++) {
      this.buffer.stripPositions.push(this.transformation.transform(strips[i][0]))
      this.buffer.stripColors.push(strips[i][1])
    }

    this.buffer.stripPositions.push(new Vector2(NaN, NaN))
    this.buffer.stripColors.push(new Color(NaN, NaN, NaN, NaN))

    return this
  }

  /**
   * @param {number} arcStart
   * @param {number} arcEnd
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  arc(arcStart, arcEnd, radiusX = 1, radiusY = 1, color = Color.WHITE.clone(), resolution = 32) {
    const spacing = (arcEnd - arcStart) / resolution
    const radii = new Vector2(radiusX, radiusY)
    const positions = []

    for (let i = 0; i <= resolution; i++) {
      const position = Vector2.fromAngle(arcStart + spacing * i).multiply(radii)

      positions.push(position)
    }

    this.lineStrip(positions, color)

    return this
  }

  /**
   * @param {Vector2} direction
   * @param {number} length
   * @param {Color} color
   * @returns {this}
   */
  arrow(
    direction = Vector2.X.clone(),
    length = 1,
    color = Color.RED.clone()
  ) {
    this.line(
      Vector2.Zero.clone(),
      direction.multiplyScalar(length),
      color
    )

    return this
  }

  /**
   * @param {Vector2} cellCount
   * @param {Vector2} spacing
   * @param {Color} color
   * @param {BVector2} drawEdges
   * @returns {this}
   */
  grid(
    cellCount = new Vector2(20, 20),
    spacing = new Vector2(1, 1),
    color = Color.WHITE,
    drawEdges = new BVector2()
  ) {
    const dimensions = Vector2.multiply(spacing, cellCount).multiplyScalar(0.5)
    const offset = new Vector2().set(
      drawEdges.x ? 0 : spacing.x,
      drawEdges.y ? 0 : spacing.y
    )

    for (let x = offset.x - dimensions.x; x <= dimensions.x - offset.x; x += spacing.x) {
      this.line(
        new Vector2(x, -dimensions.y),
        new Vector2(x, dimensions.y),
        color
      )
    }

    for (let y = offset.y - dimensions.y; y <= dimensions.y - offset.y; y += spacing.y) {
      this.line(
        new Vector2(-dimensions.x, y),
        new Vector2(dimensions.x, y),
        color
      )
    }

    return this
  }

  /**
   * @param {number} length
   * @returns {this}
   */
  axes(length) {
    this
      .arrow(
        Vector2.X.clone(),
        length,
        Color.RED.clone()
      )
      .arrow(
        Vector2.Y.clone(),
        length,
        Color.GREEN.clone()
      )

    return this
  }

  /**
   * @param {number} radius
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  circle(radius, color = Color.WHITE, resolution = 32) {
    this.arc(0, TAU, radius, radius, color, resolution)

    return this
  }

  /**
   * @param {number} halfWidth
   * @param {number} halfHeight
   * @param {Color} color
   * @returns {this}
   */
  aabb(halfWidth, halfHeight, color = Color.WHITE) {
    this.lineStrip(
      [
        new Vector2(-halfWidth, -halfHeight),
        new Vector2(-halfWidth, halfHeight),
        new Vector2(halfWidth, halfHeight),
        new Vector2(halfWidth, -halfHeight),
        new Vector2(-halfWidth, -halfHeight)
      ],
      color
    )

    return this
  }

  /**
   * @param {number} radiusX
   * @param {number} radiusY
   * @param {Color} color
   * @param {number} resolution
   * @returns {this}
   */
  ellipse(radiusX, radiusY, color = Color.WHITE, resolution = 32) {
    this.arc(0, TAU, radiusX, radiusY, color, resolution)

    return this
  }

  capsule(radius, halfHeight, color = Color.WHITE, resolution = 16) {
    const positions = []
    const top = new Vector2(0, halfHeight)
    const bottom = new Vector2(0, -halfHeight)

    for (let i = 0; i <= resolution; i++) {
      const angle = Math.PI - (Math.PI * i / resolution)
      positions.push(Vector2.fromAngle(angle).multiplyScalar(radius).add(top))
    }

    for (let i = 0; i <= resolution; i++) {
      const angle = -(Math.PI * i / resolution)
      positions.push(Vector2.fromAngle(angle).multiplyScalar(radius).add(bottom))
    }

    positions.push(positions[0].clone())

    this.lineStrip(positions, color)

    return this
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   * @returns 
   */
  draw(context) {
    if (!context) return

    context.save()
    context.lineWidth = 1
    context.lineCap = "square"
    context.lineJoin = "miter"

    // Render Lines
    for (let i = 0; i < this.buffer.positions.length; i += 2) {
      context.beginPath()
      const startPos = this.buffer.positions[i]
      const endPos = this.buffer.positions[i + 1]
      const startColor = this.buffer.colors[i]
      const endColor = this.buffer.colors[i + 1]

      const colorGradient = context.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y)

      colorGradient.addColorStop(0, `rgba(${startColor.r * 255},${startColor.g * 255},${startColor.b * 255},${startColor.a * 255})`)
      colorGradient.addColorStop(1, `rgba(${endColor.r * 255},${endColor.g * 255},${endColor.b * 255},${endColor.a * 255})`)

      context.moveTo(startPos.x, startPos.y)
      context.lineTo(endPos.x, endPos.y)
      context.strokeStyle = colorGradient
      context.stroke()
      context.closePath()
    }

    // Render strips.
    for (let i = 1; i < this.buffer.stripPositions.length; i += 1) {
      context.beginPath()
      const startPos = this.buffer.stripPositions[i - 1]
      const endPos = this.buffer.stripPositions[i]
      const startColor = this.buffer.stripColors[i - 1]
      const endColor = this.buffer.stripColors[i]

      if (isNaN(endPos.x) || isNaN(startPos.x)) continue

      const colorGradient = context.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y)

      colorGradient.addColorStop(0, `rgba(${startColor.r * 255},${startColor.g * 255},${startColor.b * 255},${startColor.a})`)
      colorGradient.addColorStop(1, `rgba(${endColor.r * 255},${endColor.g * 255},${endColor.b * 255},${endColor.a})`)
      context.moveTo(startPos.x, startPos.y)
      context.lineTo(endPos.x, endPos.y)
      context.strokeStyle = colorGradient
      context.stroke()
      context.closePath()
    }

    this.buffer.clear()
    context.restore()
  }
}

/**
 * @template T
 * Immediate mode drawing of defined 3d shapes.
 * Should be used for visual debugging.
 */
export class Gizmo3D {

  /**
   * @private
   * @type {Affine3}
   */
  transformation = new Affine3()

  /**
   * @type {GizmoBuffer<Vector3>}
   */
  buffer = new GizmoBuffer()

  /**
   */
  constructor() {
  }

  reset() {
    Affine3.identity(this.transformation)
  }
}

export class Canvas2D {
  constructor() {
    this.container = document.createElement('div')
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.gizmo = new Gizmo2D()
    this.playPauseButton = document.createElement('button')

    if (!this.context) {
      throw new Error('Canvas 2D context is not available.')
    }

    this.width = 0
    this.height = 0
    this.pixelRatio = 1
    this.draws = []
    this.rafId = 0
    this.sceneTime = 0
    this.lastFrameTime = null
    this.paused = false
    this.camera = new Vector2()
    this.zoom = 1
    this.minZoom = 0.25
    this.maxZoom = 4
    this.isPanning = false
    this.panPointerId = -1
    this.lastPointerPosition = new Vector2()
    this.activePointers = new Map()
    this.lastPinchDistance = 0
    this.lastPinchCenter = new Vector2()

    this.container.style.position = 'relative'
    this.container.style.width = '100vw'
    this.container.style.height = '100vh'
    this.canvas.style.display = 'block'
    this.canvas.style.width = '100vw'
    this.canvas.style.height = '100vh'
    this.canvas.style.touchAction = 'none'
    this.canvas.style.cursor = 'grab'
    this.playPauseButton.type = 'button'
    this.playPauseButton.textContent = 'Pause'
    this.playPauseButton.setAttribute('aria-pressed', 'false')
    this.playPauseButton.style.position = 'fixed'
    this.playPauseButton.style.top = '16px'
    this.playPauseButton.style.left = '0%'
    this.playPauseButton.style.transform = 'translateX(50%)'
    this.playPauseButton.style.zIndex = '10'
    this.playPauseButton.style.padding = '8px 14px'
    this.playPauseButton.style.border = '1px solid rgba(255, 255, 255, 0.24)'
    this.playPauseButton.style.borderRadius = '999px'
    this.playPauseButton.style.background = 'rgba(0, 0, 0, 0.72)'
    this.playPauseButton.style.color = '#ffffff'
    this.playPauseButton.style.font = '600 14px system-ui, sans-serif'
    this.playPauseButton.style.cursor = 'pointer'
    this.playPauseButton.style.backdropFilter = 'blur(10px)'
    this.playPauseButton.style.webkitBackdropFilter = 'blur(10px)'
    this.container.appendChild(this.canvas)
    this.container.appendChild(this.playPauseButton)
    document.body.appendChild(this.container)

    this.handleResize = this.handleResize.bind(this)
    this.handlePointerDown = this.handlePointerDown.bind(this)
    this.handlePointerMove = this.handlePointerMove.bind(this)
    this.handlePointerUp = this.handlePointerUp.bind(this)
    this.handleLostPointerCapture = this.handleLostPointerCapture.bind(this)
    this.handleWheel = this.handleWheel.bind(this)
    this.handleTogglePause = this.handleTogglePause.bind(this)
    this.loop = this.loop.bind(this)

    window.addEventListener('resize', this.handleResize)
    this.canvas.addEventListener('pointerdown', this.handlePointerDown)
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false })
    this.playPauseButton.addEventListener('click', this.handleTogglePause)
    window.addEventListener('pointermove', this.handlePointerMove)
    window.addEventListener('pointerup', this.handlePointerUp)
    window.addEventListener('pointercancel', this.handlePointerUp)
    this.canvas.addEventListener('lostpointercapture', this.handleLostPointerCapture)
    this.handleResize()
  }

  handleResize() {
    return this.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1)
  }

  resize(width, height, pixelRatio = 1) {
    this.width = width
    this.height = height
    this.pixelRatio = pixelRatio
    this.canvas.width = Math.max(1, Math.floor(width * pixelRatio))
    this.canvas.height = Math.max(1, Math.floor(height * pixelRatio))
    return this
  }

  start(draws) {
    this.draws = Array.isArray(draws) ? draws : [draws]
    this.sceneTime = 0
    this.lastFrameTime = null
    this.loop(0)
    return this
  }

  handleTogglePause() {
    if (this.paused) {
      this.play()
    } else {
      this.pause()
    }

    return this
  }

  pause() {
    this.paused = true
    this.playPauseButton.textContent = 'Play'
    this.playPauseButton.setAttribute('aria-pressed', 'true')
    return this
  }

  play() {
    this.paused = false
    this.lastFrameTime = null
    this.playPauseButton.textContent = 'Pause'
    this.playPauseButton.setAttribute('aria-pressed', 'false')
    return this
  }

  applyZoom(nextZoom, focusX, focusY) {
    const clampedZoom = Math.max(this.minZoom, Math.min(this.maxZoom, nextZoom))

    if (clampedZoom === this.zoom) {
      return this
    }

    const zoomRatio = clampedZoom / this.zoom
    this.camera.x = focusX - (focusX - this.camera.x) * zoomRatio
    this.camera.y = focusY - (focusY - this.camera.y) * zoomRatio
    this.zoom = clampedZoom

    return this
  }

  updatePinchGesture() {
    if (this.activePointers.size !== 2) {
      this.lastPinchDistance = 0
      return this
    }

    const pointers = Array.from(this.activePointers.values())
    const first = pointers[0]
    const second = pointers[1]
    const centerX = (first.x + second.x) * 0.5
    const centerY = (first.y + second.y) * 0.5
    const distance = Math.hypot(second.x - first.x, second.y - first.y)

    if (this.lastPinchDistance > 0) {
      this.camera.x += centerX - this.lastPinchCenter.x
      this.camera.y += centerY - this.lastPinchCenter.y
      this.applyZoom(this.zoom * (distance / this.lastPinchDistance), centerX, centerY)
    }

    this.lastPinchCenter.set(centerX, centerY)
    this.lastPinchDistance = distance

    return this
  }

  handlePointerDown(event) {
    const canPan =
      event.pointerType === 'touch' ||
      event.pointerType === 'pen' ||
      event.button === 0 ||
      event.button === 1

    if (!canPan) {
      return this
    }

    this.activePointers.set(event.pointerId, new Vector2(event.clientX, event.clientY))
    this.canvas.setPointerCapture(event.pointerId)

    if (this.activePointers.size === 1) {
      this.isPanning = true
      this.panPointerId = event.pointerId
      this.lastPointerPosition.set(event.clientX, event.clientY)
      this.canvas.style.cursor = 'grabbing'
    } else if (this.activePointers.size === 2) {
      this.isPanning = false
      this.panPointerId = -1
      this.canvas.style.cursor = 'grab'
      this.updatePinchGesture()
    }

    event.preventDefault()

    return this
  }

  handlePointerMove(event) {
    const pointer = this.activePointers.get(event.pointerId)

    if (!pointer) {
      return this
    }

    pointer.set(event.clientX, event.clientY)

    if (this.activePointers.size === 2) {
      this.updatePinchGesture()
      event.preventDefault()
      return this
    }

    if (!this.isPanning || event.pointerId !== this.panPointerId) {
      return this
    }

    const deltaX = event.clientX - this.lastPointerPosition.x
    const deltaY = event.clientY - this.lastPointerPosition.y

    this.camera.x += deltaX
    this.camera.y += deltaY
    this.lastPointerPosition.set(event.clientX, event.clientY)
    event.preventDefault()

    return this
  }

  handlePointerUp(event) {
    this.activePointers.delete(event.pointerId)

    if (this.canvas.hasPointerCapture(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId)
    }

    if (event.pointerId === this.panPointerId) {
      this.isPanning = false
      this.panPointerId = -1
      this.canvas.style.cursor = 'grab'
    }

    if (this.activePointers.size === 1) {
      const [pointerId, pointer] = this.activePointers.entries().next().value
      this.isPanning = true
      this.panPointerId = pointerId
      this.lastPointerPosition.set(pointer.x, pointer.y)
      this.lastPinchDistance = 0
      this.canvas.style.cursor = 'grabbing'
    } else {
      this.isPanning = false
      this.panPointerId = -1
      this.lastPinchDistance = 0
      this.canvas.style.cursor = 'grab'
    }

    event.preventDefault()

    return this
  }

  handleLostPointerCapture(event) {
    this.activePointers.delete(event.pointerId)

    if (event.pointerId === this.panPointerId) {
      this.isPanning = false
      this.panPointerId = -1
    }

    if (this.activePointers.size === 1) {
      const [pointerId, pointer] = this.activePointers.entries().next().value
      this.isPanning = true
      this.panPointerId = pointerId
      this.lastPointerPosition.set(pointer.x, pointer.y)
      this.canvas.style.cursor = 'grabbing'
    } else {
      this.isPanning = false
      this.panPointerId = -1
      this.lastPinchDistance = 0
      this.canvas.style.cursor = 'grab'
    }

    return this
  }

  handleWheel(event) {
    const zoomFactor = Math.exp(-event.deltaY * 0.001)
    this.applyZoom(this.zoom * zoomFactor, event.clientX, event.clientY)
    event.preventDefault()

    return this
  }

  loop(time) {
    if (this.lastFrameTime === null) {
      this.lastFrameTime = time
    } else if (!this.paused) {
      this.sceneTime += time - this.lastFrameTime
      this.lastFrameTime = time
    }

    this.clear()
    this.gizmo.reset()

    for (const draw of this.draws) {
      draw(this.gizmo, this.sceneTime)
    }

    this.context.save()
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    this.context.translate(this.camera.x, this.camera.y)
    this.context.scale(this.zoom, this.zoom)
    this.gizmo.draw(this.context)
    this.context.restore()

    this.rafId = requestAnimationFrame(this.loop)
    return this
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }

    window.removeEventListener('resize', this.handleResize)
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown)
    this.canvas.removeEventListener('lostpointercapture', this.handleLostPointerCapture)
    this.canvas.removeEventListener('wheel', this.handleWheel)
    this.playPauseButton.removeEventListener('click', this.handleTogglePause)
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('pointerup', this.handlePointerUp)
    window.removeEventListener('pointercancel', this.handlePointerUp)
    return this
  }

  clear() {
    this.context.save()
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, this.width, this.height)
    this.context.restore()
    return this
  }
}

export function drawContacts(gizmo, contacts, transformA, transformB) {
  if (!contacts || contacts.length === 0) {
    return false
  }

  for (const contact of contacts) {
    const worldContact = contact.clone().transform(transformA, transformB)
    const pointA = worldContact.pointA
    const pointB = worldContact.pointB
    const normalA = Vector2.multiplyScalar(worldContact.normalA, 20)
    const normalB = Vector2.multiplyScalar(worldContact.normalB, 20)
    const tangentA = Vector2.multiplyScalar(
      worldContact.tangentA ?? Vector2.normal(worldContact.normalA),
      20
    )
    const tangentB = Vector2.multiplyScalar(
      worldContact.tangentB ?? Vector2.normal(worldContact.normalB),
      20
    )

    gizmo
      .reset()
      .translate(pointA.x, pointA.y)
      .circle(2, Color.RED)
      .reset()
      .translate(pointB.x, pointB.y)
      .circle(2, Color.BLUE)
      .reset()
      .line(pointA, pointB, Color.CYAN)
      .line(pointA, Vector2.add(pointA, normalA), Color.RED)
      .line(pointB, Vector2.add(pointB, normalB), Color.BLUE)
      .line(pointA, Vector2.add(pointA, tangentA), Color.YELLOW)
      .line(pointB, Vector2.add(pointB, tangentB), Color.GREEN)
  }

  return true
}
