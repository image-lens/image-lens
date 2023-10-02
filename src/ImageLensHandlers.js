import ImageLens from './ImageLens'
import * as Types from './types'
import * as privateMethods from './ImageLensPrivate'

/**
 * @this {ImageLens} ImageLens
 * @param {MouseEvent} e
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Types.ImageLensItemExtended[]} itemsExtended
 */
export function MouseMoveHandler(e, canvas, ctx, itemsExtended) {
	const { plusCircleRadius } = this.getConfig()
	const { offsetX, offsetY } = e
	const offset = 2

	/** @type {{ i: number, distance: number }[]} */
	const mouseOverItems = []

	// Check if mouse is over any of the plus circles
	for (let i = 0; i < itemsExtended.length; i++) {
		const itemExtended = itemsExtended[i]
		const { centerX, centerY, clicked } = itemExtended

		const [centerXAdj, centerYAdj, xShrinkRatio, yShrinkRatio] = privateMethods.adjustCoordinates.call(
			this,
			[centerX],
			[centerY]
		)
		const midShrinkRatio = (xShrinkRatio + yShrinkRatio) / 2

		const distance = Math.sqrt((centerXAdj - offsetX + offset) ** 2 + (centerYAdj - offsetY + offset) ** 2)

		// Mouse is over plus circle
		if (distance <= plusCircleRadius * midShrinkRatio) {
			if (clicked) continue

			mouseOverItems.push({ i, distance })
		}
	}

	/** @type {Types.ImageLensItemExtended | null} */
	let hoveredItem = null

	if (mouseOverItems.length > 0) {
		const mouseOverItem = mouseOverItems.sort((a, b) => a.distance - b.distance)[0]
		hoveredItem = itemsExtended[mouseOverItem.i]
	}

	// Unhover other items
	for (const itemExtended of itemsExtended) {
		if (itemExtended !== hoveredItem && itemExtended.hovered) {
			itemExtended.hovered = false
			privateMethods.drawPlusCircle.call(this, itemExtended, ctx)
		}
	}

	// Hover this item
	if (hoveredItem !== null && !hoveredItem.hovered) {
		hoveredItem.hovered = true
		privateMethods.drawPlusCircle.call(this, hoveredItem, ctx)
	}

	canvas.style.cursor = mouseOverItems.length > 0 ? 'pointer' : 'default'
}

/**
 * @this {ImageLens} ImageLens
 * @param {MouseEvent} e
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Types.ImageLensItemExtended[]} itemsExtended
 */
export function MouseDownHandler(e, canvas, ctx, itemsExtended) {
	const { plusCircleRadius } = this.getConfig()
	const { offsetX, offsetY } = e
	const offset = 2

	const callback = this.getClickCallback()

	// Check if mouse is over any of the plus circles
	for (const itemExtended of itemsExtended) {
		const { centerX, centerY, clicked } = itemExtended

		const [centerXAdj, centerYAdj, xShrinkRatio, yShrinkRatio] = privateMethods.adjustCoordinates.call(
			this,
			[centerX],
			[centerY]
		)
		const midShrinkRatio = (xShrinkRatio + yShrinkRatio) / 2

		const distance = Math.sqrt((centerXAdj - offsetX + offset) ** 2 + (centerYAdj - offsetY + offset) ** 2)

		// Mouse is over plus circle
		if (distance <= plusCircleRadius * midShrinkRatio) {
			// First remove other clicked items if any
			for (const itemExtended2 of itemsExtended) {
				if (itemExtended2.clicked && itemExtended2 !== itemExtended) {
					itemExtended2.clicked = false
					privateMethods.drawRectangle.call(this, itemExtended2, itemsExtended, ctx, true)
				}
			}

			// Open rectangle
			if (!clicked) {
				itemExtended.clicked = true
				privateMethods.drawRectangle.call(this, itemExtended, itemsExtended, ctx)
				callback(itemExtended.item)
				canvas.style.cursor = 'default'
			}
		}
	}
}
