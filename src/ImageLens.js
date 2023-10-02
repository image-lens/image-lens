import * as Types from './types'
import * as privateMethods from './ImageLensPrivate'
import * as handlers from './ImageLensHandlers'

export class ImageLens {
	static version = '1.0.1'

	/** @type {string} Id of the image to initialize ImageLens to */
	#imageId

	/**
	 * Get the id of the image to initialize ImageLens to
	 * @returns {string}
	 */
	getImageId() {
		return this.#imageId
	}

	/**
	 * Set the id of the image to initialize ImageLens to
	 * @param {string} imageId Id of the image to initialize ImageLens to
	 * @returns {ImageLens}
	 */
	setImageId(imageId) {
		this.#imageId = imageId
		return this
	}

	/** @type {Types.ImageLensItem[]} Array of items to initialize ImageLens with */
	#items

	/**
	 * Get the array of items to initialize ImageLens with
	 * @returns {Types.ImageLensItem[]}
	 */
	getItems() {
		return this.#items
	}

	/**
	 * Set the array of items to initialize ImageLens with
	 * @param {Types.ImageLensItem[]} items Array of items to initialize ImageLens with
	 * @returns {ImageLens}
	 */
	setItems(items) {
		this.#items = items
		return this
	}

	/** @type {Types.ImageLensClickCallback} ImageLensItem click callback */
	#clickCallback = (item) => {
		console.log('ImageLens: Clicked item', item)
	}

	/**
	 * Get the ImageLensItem click callback
	 * @returns {Types.ImageLensClickCallback}
	 */
	getClickCallback() {
		return this.#clickCallback
	}

	/**
	 * Set the ImageLensItem click callback
	 * @param {Types.ImageLensClickCallback} clickCallback ImageLensItem click callback
	 * @returns {ImageLens}
	 */
	setClickCallback(clickCallback) {
		this.#clickCallback = clickCallback
		return this
	}

	/** @type {Types.ImageLensConfig} Config of the ImageLens */
	#config = {
		canvasSizeMultiplier: 1,

		plusCircleStrokeColor: 'rgba(255, 255, 255, 0.5)',
		plusCircleStrokeColorHover: 'rgba(255, 255, 255, 0.6)',
		plusCircleFillColor: 'rgba(255, 255, 255, 0.2)',
		plusCircleFillColorHover: 'rgba(255, 255, 255, 0.4)',
		plusCircleRadius: 10,
		plusCircleLineWidth: 2,

		plusIconLineWidth: 2,
		plusIconWidth: 5,
		plusIconStrokeColor: 'rgba(255, 255, 255, 0.7)',
		plusIconStrokeColorHover: 'rgba(255, 255, 255, 0.8)',

		rectangleFrames: 10,
		rectangleCircleRadius: 10,
		rectangleSublineLength: 10,
		rectangleStrokeColor: 'rgba(255, 255, 255, 1)',
		rectangleLineWidth: 2,
	}

	/**
	 * Get the config of the ImageLens
	 * @returns {Types.ImageLensConfig}
	 */
	getConfig() {
		return this.#config
	}

	/**
	 * Set the config of the ImageLens
	 * @param {Types.ImageLensConfig} config Config of the ImageLens
	 * @returns {ImageLens}
	 */
	setConfig(config) {
		for (const [key, value] of Object.entries(config)) {
			if (!Object.prototype.hasOwnProperty.call(this.#config, key)) {
				console.warn(`ImageLens: Config key "${key}" does not exist`)
				continue
			}
			this.#config[key] = value
		}
		return this
	}

	/** @type {{ w: number, h: number }} Dimentions of the actual image */
	imageDim = {
		w: 0,
		h: 0,
	}

	/** @type {{ w: number, h: number }} Current canvas dimentions  */
	refCanvasDim = {
		w: 0,
		h: 0,
	}

	/**
	 * @param {string} imageId Id of the image to initialize ImageLens to
	 * @returns {HTMLCanvasElement | undefined}
	 */
	#replaceImageWithCanvas(imageId) {
		return privateMethods.replaceImageWithCanvas.call(this, imageId)
	}

	/**
	 * @param {Types.ImageLensItemExtended} itemExtended
	 * @param {CanvasRenderingContext2D} ctx
	 */
	#drawPlusCircle(itemExtended, ctx) {
		return privateMethods.drawPlusCircle.call(this, itemExtended, ctx)
	}

	/**
	 * Initialize ImageLens
	 * @param {string=} imageId Id of the image to initialize ImageLens to
	 * @param {Types.ImageLensConfig=} config Config of the ImageLens
	 * @param {Types.ImageLensItem[]=} items Array of items to initialize ImageLens with
	 * @returns {HTMLCanvasElement | undefined}
	 */
	init(imageId, config, items) {
		if (imageId !== undefined) {
			this.setImageId(imageId)
		}
		if (this.#imageId === undefined) {
			console.warn('ImageLens: No image id provided. Either set it with setImageId() or pass it to init()')
			return undefined
		}

		if (config !== undefined) {
			this.setConfig(config)
		}

		if (items !== undefined) {
			this.setItems(items)
		}
		if (this.#items === undefined) {
			console.warn('ImageLens: No items provided. Either set them with setItems() or pass them to init()')
			return undefined
		}

		const canvas = this.#replaceImageWithCanvas(imageId)
		if (canvas === undefined) return this

		const ctx = canvas.getContext('2d')
		if (ctx === null) {
			console.warn('ImageLens: Unable to get canvas context')
			return undefined
		}

		/** @type {Types.ImageLensItemExtended[]} */
		const itemsExtended = this.#items.map((item) => ({
			...item,
			centerX: (item.pos.x1 + item.pos.x2) / 2,
			centerY: (item.pos.y1 + item.pos.y2) / 2,
			hovered: false,
			clicked: false,
		}))

		for (const itemExtended of itemsExtended) {
			this.#drawPlusCircle(itemExtended, ctx)
		}

		canvas.addEventListener('mousemove', (e) => {
			handlers.MouseMoveHandler.call(this, e, canvas, ctx, itemsExtended)
		})
		canvas.addEventListener('mousedown', (e) => {
			handlers.MouseDownHandler.call(this, e, canvas, ctx, itemsExtended)
		})

		addEventListener('resize', (e) => {
			this.refCanvasDim = {
				w: canvas.clientWidth,
				h: canvas.clientHeight,
			}
		})

		return canvas
	}
}

export default ImageLens
