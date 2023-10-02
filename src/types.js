/**
 * @typedef ImageLensPosition
 * Position of the {@link ImageLensItem} (see {@link ImageLensItem.pos})
 *
 * @property {number} x1 Top left x coordinate
 * @property {number} x2 Bottom right x coordinate
 * @property {number} y1 Top left y coordinate
 * @property {number} y2 Bottom right y coordinate
 */

/**
 * @typedef {(item: any) => void} ImageLensClickCallback
 * Callback to be executed when the item is clicked
 */

/**
 * @typedef ImageLensItem
 * Item to be displayed in the lens
 *
 * @property {ImageLensPosition} pos Position of the item (see {@link ImageLensPosition})
 * @property {any} item Any data associated with the lens
 */

/**
 * @typedef ImageLensConfig
 * Config of the ImageLens
 *
 * @property {number} canvasSizeMultiplier Multiplier of the canvas size (If set to 2 - canvas size (not canvas dimetions on the page) will be 2x the image size, therefore drawing quality would be 2x better)
 *
 * @property {string} plusCircleStrokeColor Color of the plus circle stroke
 * @property {string} plusCircleStrokeColorHover Color of the plus circle stroke when hovered
 * @property {string} plusCircleFillColor Color of the plus circle fill
 * @property {string} plusCircleFillColorHover Color of the plus circle fill when hovered
 * @property {number} plusCircleRadius Radius of the plus circle
 * @property {number} plusCircleLineWidth Width of the plus circle stroke
 *
 * @property {number} plusIconLineWidth Width of the plus icon stroke
 * @property {number} plusIconWidth Number of pixels of the plus icon radius
 * @property {string} plusIconStrokeColor Color of the plus icon stroke
 * @property {string} plusIconStrokeColorHover Color of the plus icon stroke when hovered
 *
 * @property {number} rectangleFrames Number of frames for the rectangle to appear
 * @property {number} rectangleCircleRadius Corner radius of the rectangle
 * @property {number} rectangleSublineLength Length of the subline of the rectangle (lines that go beyond the corner arc)
 * @property {string} rectangleStrokeColor Color of the rectangle stroke
 * @property {number} rectangleLineWidth Width of the rectangle stroke
 */

/**
 * @typedef {object} ImageLensItemExtra
 * Extra properties for the {@link ImageLensItem} for internal use
 *
 * @property {number} centerX Center x coordinate of the item
 * @property {number} centerY Center y coordinate of the item
 * @property {boolean} hovered Whether the item is hovered
 * @property {boolean} clicked Whether the item is clicked
 */

/**
 * @typedef { ImageLensItem & ImageLensItemExtra } ImageLensItemExtended
 * {@link ImageLensItem} with additional properties (see {@link ImageLensItemExtra}) for internal use
 */

export const Types = {}
