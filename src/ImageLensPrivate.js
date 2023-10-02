import ImageLens from './ImageLens'
import * as Types from './types'

/**
 * @this {ImageLens} ImageLens
 * @returns {[number, number]}
 */
export function getShrinkRatio() {
	const xShrinkRatio = this.refCanvasDim.w / this.imageDim.w
	const yShrinkRatio = this.refCanvasDim.h / this.imageDim.h

	return [xShrinkRatio, yShrinkRatio]
}

/**
 * @this {ImageLens} ImageLens
 * @param {number[]} xArr
 * @param {number[]} yArr
 * @returns {[ number[], number[], number, number ]}
 */
export function adjustCoordinates(xArr, yArr) {
	const [xShrinkRatio, yShrinkRatio] = getShrinkRatio.call(this)

	const xRes = []
	for (const x of xArr) {
		xRes.push(x * xShrinkRatio)
	}

	const yRes = []
	for (const y of yArr) {
		yRes.push(y * yShrinkRatio)
	}

	return [xRes, yRes, xShrinkRatio, yShrinkRatio]
}

/**
 * @this {ImageLens} ImageLens
 * @param {string} imageId Id of the image to initialize ImageLens to
 * @returns {HTMLCanvasElement | undefined}
 */
export function replaceImageWithCanvas(imageId) {
	const { canvasSizeMultiplier } = this.getConfig()

	const imageElement = document.getElementById(imageId)
	if (imageElement === null) {
		console.warn(`ImageLens: Unable to find DOM element with id "${imageId}"`)
		return undefined
	}

	// Load image locally to get its dimentions
	var img = new Image()
	img.src = imageElement.src

	// Store initial image dimentions
	this.imageDim = {
		w: img.width,
		h: img.height,
	}

	// Create canvas
	const canvas = document.createElement('canvas')
	canvas.id = `ImageLens_${imageId}`
	canvas.width = img.width * canvasSizeMultiplier
	canvas.height = img.height * canvasSizeMultiplier
	canvas.style.background = `url(${imageElement.src})`
	canvas.style.backgroundSize = '100% 100%'

	// Hide image
	imageElement.style.display = 'none'

	imageElement.parentNode.replaceChild(canvas, imageElement)

	this.refCanvasDim = {
		w: canvas.clientWidth,
		h: canvas.clientHeight,
	}

	return canvas
}

/**
 * @this {ImageLens} ImageLens
 * @param {Types.ImageLensItemExtended} itemExtended
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawPlusCircle(itemExtended, ctx) {
	const {
		canvasSizeMultiplier,
		plusCircleRadius,
		plusCircleLineWidth,
		plusCircleStrokeColorHover,
		plusCircleStrokeColor,
		plusCircleFillColorHover,
		plusCircleFillColor,
		plusIconLineWidth,
		plusIconStrokeColorHover,
		plusIconStrokeColor,
		plusIconWidth,
	} = this.getConfig()

	const { clicked, hovered, centerX, centerY } = itemExtended

	if (clicked) return

	// Clear this position
	ctx.save()
	ctx.beginPath()
	ctx.arc(
		centerX * canvasSizeMultiplier,
		centerY * canvasSizeMultiplier,
		plusCircleRadius * canvasSizeMultiplier + (plusCircleLineWidth * canvasSizeMultiplier) / 2 + 1,
		0,
		Math.PI * 2
	)
	ctx.clip()
	ctx.clearRect(
		centerX * canvasSizeMultiplier -
			plusCircleRadius * canvasSizeMultiplier -
			plusCircleLineWidth * canvasSizeMultiplier,
		centerY * canvasSizeMultiplier -
			plusCircleRadius * canvasSizeMultiplier -
			plusCircleLineWidth * canvasSizeMultiplier,
		plusCircleRadius * canvasSizeMultiplier * 2 + plusCircleLineWidth * canvasSizeMultiplier * 2 + 0,
		plusCircleRadius * canvasSizeMultiplier * 2 + plusCircleLineWidth * canvasSizeMultiplier * 2 + 0
	)
	ctx.restore()

	// Draw circle
	ctx.lineWidth = plusCircleLineWidth * canvasSizeMultiplier
	ctx.strokeStyle = hovered ? plusCircleStrokeColorHover : plusCircleStrokeColor
	ctx.fillStyle = hovered ? plusCircleFillColorHover : plusCircleFillColor

	ctx.beginPath()
	ctx.arc(
		centerX * canvasSizeMultiplier,
		centerY * canvasSizeMultiplier,
		plusCircleRadius * canvasSizeMultiplier,
		0,
		Math.PI * 2
	)
	ctx.fill()
	ctx.stroke()
	ctx.closePath()

	// Draw plus icon
	ctx.lineWidth = plusIconLineWidth * canvasSizeMultiplier
	ctx.strokeStyle = hovered ? plusIconStrokeColorHover : plusIconStrokeColor

	ctx.beginPath()
	ctx.moveTo(centerX * canvasSizeMultiplier - plusIconWidth * canvasSizeMultiplier, centerY * canvasSizeMultiplier)
	ctx.lineTo(centerX * canvasSizeMultiplier + plusIconWidth * canvasSizeMultiplier, centerY * canvasSizeMultiplier)
	ctx.moveTo(centerX * canvasSizeMultiplier, centerY * canvasSizeMultiplier - plusIconWidth * canvasSizeMultiplier)
	ctx.lineTo(centerX * canvasSizeMultiplier, centerY * canvasSizeMultiplier + plusIconWidth * canvasSizeMultiplier)
	ctx.stroke()
	ctx.closePath()
}

/**
 * @this {ImageLens} ImageLens
 * @param {Types.ImageLensItemExtended} itemExtended
 * @param {Types.ImageLensItemExtended[]} itemsExtended
 * @param {CanvasRenderingContext2D} ctx
 * @param {boolean} [reverse=false]
 */
export function drawRectangle(itemExtended, itemsExtended, ctx, reverse = false) {
	const {
		canvasSizeMultiplier,
		rectangleFrames,
		rectangleCircleRadius,
		plusCircleLineWidth,
		rectangleLineWidth,
		rectangleStrokeColor,
		rectangleSublineLength,
	} = this.getConfig()

	const { centerX, centerY, pos } = itemExtended
	const { x1, x2, y1, y2 } = pos

	let curFrame = reverse ? Math.max(Math.floor(rectangleFrames * 0.75), 0) : 1

	const width = Math.abs(x2 * canvasSizeMultiplier - x1 * canvasSizeMultiplier)
	const height = Math.abs(y2 * canvasSizeMultiplier - y1 * canvasSizeMultiplier)

	const xStep = width / rectangleFrames / 2
	const yStep = height / rectangleFrames / 2

	const animate = () => {
		if (curFrame < 0) {
			// Clear rectangle area one more time since on the last frame it shrinks to the size of the plus circle (and plus circle does not clear the whole area)
			ctx.clearRect(
				x1 * canvasSizeMultiplier -
					rectangleCircleRadius * canvasSizeMultiplier -
					plusCircleLineWidth * canvasSizeMultiplier,
				y1 * canvasSizeMultiplier -
					rectangleCircleRadius * canvasSizeMultiplier -
					plusCircleLineWidth * canvasSizeMultiplier,
				width + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2,
				height + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2
			)
			return
		}
		if (curFrame > rectangleFrames) {
			return
		}

		const framesMinusFrame = rectangleFrames - curFrame
		const frameWidth = framesMinusFrame <= 0 ? width : width / framesMinusFrame
		const frameHeight = framesMinusFrame <= 0 ? height : height / framesMinusFrame

		const framePos = {
			x1: centerX * canvasSizeMultiplier - xStep * curFrame,
			y1: centerY * canvasSizeMultiplier - yStep * curFrame,
			x2: centerX * canvasSizeMultiplier + xStep * curFrame,
			y2: centerY * canvasSizeMultiplier + yStep * curFrame,
		}

		// Clear prev animation frame
		ctx.clearRect(
			x1 * canvasSizeMultiplier -
				rectangleCircleRadius * canvasSizeMultiplier -
				plusCircleLineWidth * canvasSizeMultiplier,
			y1 * canvasSizeMultiplier -
				rectangleCircleRadius * canvasSizeMultiplier -
				plusCircleLineWidth * canvasSizeMultiplier,
			width + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2,
			height + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2
		)

		const deg90 = Math.PI / 2

		ctx.lineWidth = rectangleLineWidth * canvasSizeMultiplier
		ctx.strokeStyle = rectangleStrokeColor

		// Bottom right corner
		{
			ctx.beginPath()
			ctx.arc(framePos.x2, framePos.y2, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 0, deg90 * 1)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x2, framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier)
			ctx.lineTo(
				framePos.x2 - rectangleSublineLength * canvasSizeMultiplier,
				framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier, framePos.y2)
			ctx.lineTo(
				framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier,
				framePos.y2 - rectangleSublineLength * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()
		}

		// Bottom left corner
		{
			ctx.beginPath()
			ctx.arc(framePos.x1, framePos.y2, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 1, deg90 * 2)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x1, framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier)
			ctx.lineTo(
				framePos.x1 + rectangleSublineLength * canvasSizeMultiplier,
				framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier, framePos.y2)
			ctx.lineTo(
				framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier,
				framePos.y2 - rectangleSublineLength * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()
		}

		// Top left corner
		{
			ctx.beginPath()
			ctx.arc(framePos.x1, framePos.y1, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 2, deg90 * 3)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x1, framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier)
			ctx.lineTo(
				framePos.x1 + rectangleSublineLength * canvasSizeMultiplier,
				framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier, framePos.y1)
			ctx.lineTo(
				framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier,
				framePos.y1 + rectangleSublineLength * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()
		}

		// Top right corner
		{
			ctx.beginPath()
			ctx.arc(framePos.x2, framePos.y1, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 3, deg90 * 4)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x2, framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier)
			ctx.lineTo(
				framePos.x2 - rectangleSublineLength * canvasSizeMultiplier,
				framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()

			ctx.beginPath()
			ctx.moveTo(framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier, framePos.y1)
			ctx.lineTo(
				framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier,
				framePos.y1 + rectangleSublineLength * canvasSizeMultiplier
			)
			ctx.stroke()
			ctx.closePath()
		}

		// Redraw all plus circles cince they may get cleared by rectangle
		for (const itemExtended2 of itemsExtended) {
			drawPlusCircle.call(this, itemExtended2, ctx)
		}

		curFrame = reverse ? curFrame - 1 : curFrame + 1
		requestAnimationFrame(animate)
	}
	animate()
}
