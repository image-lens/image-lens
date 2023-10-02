/*!
* ImageLens v1.0.0
* GitHub: https://github.com/kirillovmr/image-lens#readme
* Released under the MIT License.
* (c) 2023 Viktor Kirillov (https://kirillovmr.com)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ImageLens = factory());
})(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
  }
  function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
  }
  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
  }
  function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }
    return descriptor.value;
  }
  function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }
      descriptor.value = value;
    }
  }
  function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
  }
  function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }
  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
  }
  function _classPrivateMethodInitSpec(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
  }

  /**
   * @this {ImageLens} ImageLens
   * @returns {[number, number]}
   */
  function getShrinkRatio() {
    const xShrinkRatio = this.refCanvasDim.w / this.imageDim.w;
    const yShrinkRatio = this.refCanvasDim.h / this.imageDim.h;
    return [xShrinkRatio, yShrinkRatio];
  }

  /**
   * @this {ImageLens} ImageLens
   * @param {number[]} xArr
   * @param {number[]} yArr
   * @returns {[ number[], number[], number, number ]}
   */
  function adjustCoordinates(xArr, yArr) {
    const [xShrinkRatio, yShrinkRatio] = getShrinkRatio.call(this);
    const xRes = [];
    for (const x of xArr) {
      xRes.push(x * xShrinkRatio);
    }
    const yRes = [];
    for (const y of yArr) {
      yRes.push(y * yShrinkRatio);
    }
    return [xRes, yRes, xShrinkRatio, yShrinkRatio];
  }

  /**
   * @this {ImageLens} ImageLens
   * @param {string} imageId Id of the image to initialize ImageLens to
   * @returns {HTMLCanvasElement | undefined}
   */
  function replaceImageWithCanvas(imageId) {
    const {
      canvasSizeMultiplier
    } = this.getConfig();
    const imageElement = document.getElementById(imageId);
    if (imageElement === null) {
      console.warn("ImageLens: Unable to find DOM element with id \"".concat(imageId, "\""));
      return undefined;
    }

    // Load image locally to get its dimentions
    var img = new Image();
    img.src = imageElement.src;

    // Store initial image dimentions
    this.imageDim = {
      w: img.width,
      h: img.height
    };

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = "ImageLens_".concat(imageId);
    canvas.width = img.width * canvasSizeMultiplier;
    canvas.height = img.height * canvasSizeMultiplier;
    canvas.style.background = "url(".concat(imageElement.src, ")");
    canvas.style.backgroundSize = '100% 100%';

    // Hide image
    imageElement.style.display = 'none';
    imageElement.parentNode.replaceChild(canvas, imageElement);
    this.refCanvasDim = {
      w: canvas.clientWidth,
      h: canvas.clientHeight
    };
    return canvas;
  }

  /**
   * @this {ImageLens} ImageLens
   * @param {Types.ImageLensItemExtended} itemExtended
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawPlusCircle(itemExtended, ctx) {
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
      plusIconWidth
    } = this.getConfig();
    const {
      clicked,
      hovered,
      centerX,
      centerY
    } = itemExtended;
    if (clicked) return;

    // Clear this position
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX * canvasSizeMultiplier, centerY * canvasSizeMultiplier, plusCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier / 2 + 1, 0, Math.PI * 2);
    ctx.clip();
    ctx.clearRect(centerX * canvasSizeMultiplier - plusCircleRadius * canvasSizeMultiplier - plusCircleLineWidth * canvasSizeMultiplier, centerY * canvasSizeMultiplier - plusCircleRadius * canvasSizeMultiplier - plusCircleLineWidth * canvasSizeMultiplier, plusCircleRadius * canvasSizeMultiplier * 2 + plusCircleLineWidth * canvasSizeMultiplier * 2 + 0, plusCircleRadius * canvasSizeMultiplier * 2 + plusCircleLineWidth * canvasSizeMultiplier * 2 + 0);
    ctx.restore();

    // Draw circle
    ctx.lineWidth = plusCircleLineWidth * canvasSizeMultiplier;
    ctx.strokeStyle = hovered ? plusCircleStrokeColorHover : plusCircleStrokeColor;
    ctx.fillStyle = hovered ? plusCircleFillColorHover : plusCircleFillColor;
    ctx.beginPath();
    ctx.arc(centerX * canvasSizeMultiplier, centerY * canvasSizeMultiplier, plusCircleRadius * canvasSizeMultiplier, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Draw plus icon
    ctx.lineWidth = plusIconLineWidth * canvasSizeMultiplier;
    ctx.strokeStyle = hovered ? plusIconStrokeColorHover : plusIconStrokeColor;
    ctx.beginPath();
    ctx.moveTo(centerX * canvasSizeMultiplier - plusIconWidth * canvasSizeMultiplier, centerY * canvasSizeMultiplier);
    ctx.lineTo(centerX * canvasSizeMultiplier + plusIconWidth * canvasSizeMultiplier, centerY * canvasSizeMultiplier);
    ctx.moveTo(centerX * canvasSizeMultiplier, centerY * canvasSizeMultiplier - plusIconWidth * canvasSizeMultiplier);
    ctx.lineTo(centerX * canvasSizeMultiplier, centerY * canvasSizeMultiplier + plusIconWidth * canvasSizeMultiplier);
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * @this {ImageLens} ImageLens
   * @param {Types.ImageLensItemExtended} itemExtended
   * @param {Types.ImageLensItemExtended[]} itemsExtended
   * @param {CanvasRenderingContext2D} ctx
   * @param {boolean} [reverse=false]
   */
  function drawRectangle(itemExtended, itemsExtended, ctx) {
    let reverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    const {
      canvasSizeMultiplier,
      rectangleFrames,
      rectangleCircleRadius,
      plusCircleLineWidth,
      rectangleLineWidth,
      rectangleStrokeColor,
      rectangleSublineLength
    } = this.getConfig();
    const {
      centerX,
      centerY,
      pos
    } = itemExtended;
    const {
      x1,
      x2,
      y1,
      y2
    } = pos;
    let curFrame = reverse ? Math.max(Math.floor(rectangleFrames * 0.75), 0) : 1;
    const width = Math.abs(x2 * canvasSizeMultiplier - x1 * canvasSizeMultiplier);
    const height = Math.abs(y2 * canvasSizeMultiplier - y1 * canvasSizeMultiplier);
    const xStep = width / rectangleFrames / 2;
    const yStep = height / rectangleFrames / 2;
    const animate = () => {
      if (curFrame < 0) {
        // Clear rectangle area one more time since on the last frame it shrinks to the size of the plus circle (and plus circle does not clear the whole area)
        ctx.clearRect(x1 * canvasSizeMultiplier - rectangleCircleRadius * canvasSizeMultiplier - plusCircleLineWidth * canvasSizeMultiplier, y1 * canvasSizeMultiplier - rectangleCircleRadius * canvasSizeMultiplier - plusCircleLineWidth * canvasSizeMultiplier, width + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2, height + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2);
        return;
      }
      if (curFrame > rectangleFrames) {
        return;
      }
      const framePos = {
        x1: centerX * canvasSizeMultiplier - xStep * curFrame,
        y1: centerY * canvasSizeMultiplier - yStep * curFrame,
        x2: centerX * canvasSizeMultiplier + xStep * curFrame,
        y2: centerY * canvasSizeMultiplier + yStep * curFrame
      };

      // Clear prev animation frame
      ctx.clearRect(x1 * canvasSizeMultiplier - rectangleCircleRadius * canvasSizeMultiplier - plusCircleLineWidth * canvasSizeMultiplier, y1 * canvasSizeMultiplier - rectangleCircleRadius * canvasSizeMultiplier - plusCircleLineWidth * canvasSizeMultiplier, width + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2, height + (rectangleCircleRadius * canvasSizeMultiplier + plusCircleLineWidth * canvasSizeMultiplier) * 2);
      const deg90 = Math.PI / 2;
      ctx.lineWidth = rectangleLineWidth * canvasSizeMultiplier;
      ctx.strokeStyle = rectangleStrokeColor;

      // Bottom right corner
      {
        ctx.beginPath();
        ctx.arc(framePos.x2, framePos.y2, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 0, deg90 * 1);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x2, framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier);
        ctx.lineTo(framePos.x2 - rectangleSublineLength * canvasSizeMultiplier, framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier, framePos.y2);
        ctx.lineTo(framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier, framePos.y2 - rectangleSublineLength * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
      }

      // Bottom left corner
      {
        ctx.beginPath();
        ctx.arc(framePos.x1, framePos.y2, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 1, deg90 * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x1, framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier);
        ctx.lineTo(framePos.x1 + rectangleSublineLength * canvasSizeMultiplier, framePos.y2 + rectangleCircleRadius * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier, framePos.y2);
        ctx.lineTo(framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier, framePos.y2 - rectangleSublineLength * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
      }

      // Top left corner
      {
        ctx.beginPath();
        ctx.arc(framePos.x1, framePos.y1, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 2, deg90 * 3);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x1, framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier);
        ctx.lineTo(framePos.x1 + rectangleSublineLength * canvasSizeMultiplier, framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier, framePos.y1);
        ctx.lineTo(framePos.x1 - rectangleCircleRadius * canvasSizeMultiplier, framePos.y1 + rectangleSublineLength * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
      }

      // Top right corner
      {
        ctx.beginPath();
        ctx.arc(framePos.x2, framePos.y1, rectangleCircleRadius * canvasSizeMultiplier, deg90 * 3, deg90 * 4);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x2, framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier);
        ctx.lineTo(framePos.x2 - rectangleSublineLength * canvasSizeMultiplier, framePos.y1 - rectangleCircleRadius * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier, framePos.y1);
        ctx.lineTo(framePos.x2 + rectangleCircleRadius * canvasSizeMultiplier, framePos.y1 + rectangleSublineLength * canvasSizeMultiplier);
        ctx.stroke();
        ctx.closePath();
      }

      // Redraw all plus circles cince they may get cleared by rectangle
      for (const itemExtended2 of itemsExtended) {
        drawPlusCircle.call(this, itemExtended2, ctx);
      }
      curFrame = reverse ? curFrame - 1 : curFrame + 1;
      requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * @this {ImageLens} ImageLens
   * @param {MouseEvent} e
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {Types.ImageLensItemExtended[]} itemsExtended
   */
  function MouseMoveHandler(e, canvas, ctx, itemsExtended) {
    const {
      plusCircleRadius
    } = this.getConfig();
    const {
      offsetX,
      offsetY
    } = e;
    const offset = 2;

    /** @type {{ i: number, distance: number }[]} */
    const mouseOverItems = [];

    // Check if mouse is over any of the plus circles
    for (let i = 0; i < itemsExtended.length; i++) {
      const itemExtended = itemsExtended[i];
      const {
        centerX,
        centerY,
        clicked
      } = itemExtended;
      const [centerXAdj, centerYAdj, xShrinkRatio, yShrinkRatio] = adjustCoordinates.call(this, [centerX], [centerY]);
      const midShrinkRatio = (xShrinkRatio + yShrinkRatio) / 2;
      const distance = Math.sqrt((centerXAdj - offsetX + offset) ** 2 + (centerYAdj - offsetY + offset) ** 2);

      // Mouse is over plus circle
      if (distance <= plusCircleRadius * midShrinkRatio) {
        if (clicked) continue;
        mouseOverItems.push({
          i,
          distance
        });
      }
    }

    /** @type {Types.ImageLensItemExtended | null} */
    let hoveredItem = null;
    if (mouseOverItems.length > 0) {
      const mouseOverItem = mouseOverItems.sort((a, b) => a.distance - b.distance)[0];
      hoveredItem = itemsExtended[mouseOverItem.i];
    }

    // Unhover other items
    for (const itemExtended of itemsExtended) {
      if (itemExtended !== hoveredItem && itemExtended.hovered) {
        itemExtended.hovered = false;
        drawPlusCircle.call(this, itemExtended, ctx);
      }
    }

    // Hover this item
    if (hoveredItem !== null && !hoveredItem.hovered) {
      hoveredItem.hovered = true;
      drawPlusCircle.call(this, hoveredItem, ctx);
    }
    canvas.style.cursor = mouseOverItems.length > 0 ? 'pointer' : 'default';
  }

  /**
   * @this {ImageLens} ImageLens
   * @param {MouseEvent} e
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {Types.ImageLensItemExtended[]} itemsExtended
   */
  function MouseDownHandler(e, canvas, ctx, itemsExtended) {
    const {
      plusCircleRadius
    } = this.getConfig();
    const {
      offsetX,
      offsetY
    } = e;
    const offset = 2;
    const callback = this.getClickCallback();

    // Check if mouse is over any of the plus circles
    for (const itemExtended of itemsExtended) {
      const {
        centerX,
        centerY,
        clicked
      } = itemExtended;
      const [centerXAdj, centerYAdj, xShrinkRatio, yShrinkRatio] = adjustCoordinates.call(this, [centerX], [centerY]);
      const midShrinkRatio = (xShrinkRatio + yShrinkRatio) / 2;
      const distance = Math.sqrt((centerXAdj - offsetX + offset) ** 2 + (centerYAdj - offsetY + offset) ** 2);

      // Mouse is over plus circle
      if (distance <= plusCircleRadius * midShrinkRatio) {
        // First remove other clicked items if any
        for (const itemExtended2 of itemsExtended) {
          if (itemExtended2.clicked && itemExtended2 !== itemExtended) {
            itemExtended2.clicked = false;
            drawRectangle.call(this, itemExtended2, itemsExtended, ctx, true);
          }
        }

        // Open rectangle
        if (!clicked) {
          itemExtended.clicked = true;
          drawRectangle.call(this, itemExtended, itemsExtended, ctx);
          callback(itemExtended.item);
          canvas.style.cursor = 'default';
        }
      }
    }
  }

  var _imageId = /*#__PURE__*/new WeakMap();
  var _items = /*#__PURE__*/new WeakMap();
  var _clickCallback = /*#__PURE__*/new WeakMap();
  var _config = /*#__PURE__*/new WeakMap();
  var _replaceImageWithCanvas = /*#__PURE__*/new WeakSet();
  var _drawPlusCircle = /*#__PURE__*/new WeakSet();
  class ImageLens {
    constructor() {
      /**
       * @param {Types.ImageLensItemExtended} itemExtended
       * @param {CanvasRenderingContext2D} ctx
       */
      _classPrivateMethodInitSpec(this, _drawPlusCircle);
      /**
       * @param {string} imageId Id of the image to initialize ImageLens to
       * @returns {HTMLCanvasElement | undefined}
       */
      _classPrivateMethodInitSpec(this, _replaceImageWithCanvas);
      /** @type {string} Id of the image to initialize ImageLens to */
      _classPrivateFieldInitSpec(this, _imageId, {
        writable: true,
        value: void 0
      });
      /** @type {Types.ImageLensItem[]} Array of items to initialize ImageLens with */
      _classPrivateFieldInitSpec(this, _items, {
        writable: true,
        value: void 0
      });
      /** @type {Types.ImageLensClickCallback} ImageLensItem click callback */
      _classPrivateFieldInitSpec(this, _clickCallback, {
        writable: true,
        value: item => {
          console.log('ImageLens: Clicked item', item);
        }
      });
      /** @type {Types.ImageLensConfig} Config of the ImageLens */
      _classPrivateFieldInitSpec(this, _config, {
        writable: true,
        value: {
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
          rectangleLineWidth: 2
        }
      });
      /** @type {{ w: number, h: number }} Dimentions of the actual image */
      _defineProperty(this, "imageDim", {
        w: 0,
        h: 0
      });
      /** @type {{ w: number, h: number }} Current canvas dimentions  */
      _defineProperty(this, "refCanvasDim", {
        w: 0,
        h: 0
      });
    }
    /**
     * Get the id of the image to initialize ImageLens to
     * @returns {string}
     */
    getImageId() {
      return _classPrivateFieldGet(this, _imageId);
    }

    /**
     * Set the id of the image to initialize ImageLens to
     * @param {string} imageId Id of the image to initialize ImageLens to
     * @returns {ImageLens}
     */
    setImageId(imageId) {
      _classPrivateFieldSet(this, _imageId, imageId);
      return this;
    }
    /**
     * Get the array of items to initialize ImageLens with
     * @returns {Types.ImageLensItem[]}
     */
    getItems() {
      return _classPrivateFieldGet(this, _items);
    }

    /**
     * Set the array of items to initialize ImageLens with
     * @param {Types.ImageLensItem[]} items Array of items to initialize ImageLens with
     * @returns {ImageLens}
     */
    setItems(items) {
      _classPrivateFieldSet(this, _items, items);
      return this;
    }
    /**
     * Get the ImageLensItem click callback
     * @returns {Types.ImageLensClickCallback}
     */
    getClickCallback() {
      return _classPrivateFieldGet(this, _clickCallback);
    }

    /**
     * Set the ImageLensItem click callback
     * @param {Types.ImageLensClickCallback} clickCallback ImageLensItem click callback
     * @returns {ImageLens}
     */
    setClickCallback(clickCallback) {
      _classPrivateFieldSet(this, _clickCallback, clickCallback);
      return this;
    }
    /**
     * Get the config of the ImageLens
     * @returns {Types.ImageLensConfig}
     */
    getConfig() {
      return _classPrivateFieldGet(this, _config);
    }

    /**
     * Set the config of the ImageLens
     * @param {Types.ImageLensConfig} config Config of the ImageLens
     * @returns {ImageLens}
     */
    setConfig(config) {
      for (const [key, value] of Object.entries(config)) {
        if (!Object.prototype.hasOwnProperty.call(_classPrivateFieldGet(this, _config), key)) {
          console.warn("ImageLens: Config key \"".concat(key, "\" does not exist"));
          continue;
        }
        _classPrivateFieldGet(this, _config)[key] = value;
      }
      return this;
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
        this.setImageId(imageId);
      }
      if (_classPrivateFieldGet(this, _imageId) === undefined) {
        console.warn('ImageLens: No image id provided. Either set it with setImageId() or pass it to init()');
        return undefined;
      }
      if (config !== undefined) {
        this.setConfig(config);
      }
      if (items !== undefined) {
        this.setItems(items);
      }
      if (_classPrivateFieldGet(this, _items) === undefined) {
        console.warn('ImageLens: No items provided. Either set them with setItems() or pass them to init()');
        return undefined;
      }
      const canvas = _classPrivateMethodGet(this, _replaceImageWithCanvas, _replaceImageWithCanvas2).call(this, imageId);
      if (canvas === undefined) return this;
      const ctx = canvas.getContext('2d');
      if (ctx === null) {
        console.warn('ImageLens: Unable to get canvas context');
        return undefined;
      }

      /** @type {Types.ImageLensItemExtended[]} */
      const itemsExtended = _classPrivateFieldGet(this, _items).map(item => ({
        ...item,
        centerX: (item.pos.x1 + item.pos.x2) / 2,
        centerY: (item.pos.y1 + item.pos.y2) / 2,
        hovered: false,
        clicked: false
      }));
      for (const itemExtended of itemsExtended) {
        _classPrivateMethodGet(this, _drawPlusCircle, _drawPlusCircle2).call(this, itemExtended, ctx);
      }
      canvas.addEventListener('mousemove', e => {
        MouseMoveHandler.call(this, e, canvas, ctx, itemsExtended);
      });
      canvas.addEventListener('mousedown', e => {
        MouseDownHandler.call(this, e, canvas, ctx, itemsExtended);
      });
      addEventListener('resize', e => {
        this.refCanvasDim = {
          w: canvas.clientWidth,
          h: canvas.clientHeight
        };
      });
      return canvas;
    }
  }
  function _replaceImageWithCanvas2(imageId) {
    return replaceImageWithCanvas.call(this, imageId);
  }
  function _drawPlusCircle2(itemExtended, ctx) {
    return drawPlusCircle.call(this, itemExtended, ctx);
  }
  _defineProperty(ImageLens, "version", '1.0.0');

  // @ts-ignore
  ImageLens.default = ImageLens;
  if (typeof window !== 'undefined') {
    console.log('');
    console.log("%c\u2728 ImageLens v".concat(ImageLens.version), 'color: black; background: white; font-size: 1.5em; padding: 0.25rem; margin: 0.5rem 0; border-radius: 4px; text-shadow: 1px 1px 0 #fffedd;');
    console.log('');
  }

  return ImageLens;

}));
