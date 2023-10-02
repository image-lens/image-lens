# ImageLens v1.0.1

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![](https://data.jsdelivr.com/v1/package/gh/image-lens/image-lens/badge)](https://www.jsdelivr.com/package/gh/image-lens/image-lens)

✨ A beautiful, responsive and customizable library to add click functionality to images.<br /><br />
✨ Lightweight<br />
✨ ZERO dependencies<br />

<img src="assets/ImageLens-demo.gif" alt="ImageLens demo">

✨ ImageLens gives you a way to make images more interactive.<br />
✨ Define clickable areas to identify objects on your image and continue with your integration upon callback.<br />
✨ Could be used on shopping / gallery / showroom websites, show related images or products, etc.<br />

## Installation

-   Install on the website with jsDelivr

```html
<script src="https://cdn.jsdelivr.net/gh/image-lens/image-lens@v1.0.2/dist/ImageLens.min.js"></script>
```

## Usage

On a webpage you should have `<img>` tag with some id set to it, for example:

```html
<img id="myImage" src="img1.jpeg" alt="" />
```

Create new ImageLens instance and bind it to that image:

```js
const il = new ImageLens()
il.setImageId('myImage')
```

[Optional] Define how ImageLens should behave on that image (this is the default config):

```js
il.setConfig({
	/**
	 * When changing the config - you don't have to provide all config fields.
	 * Just provide any that you want to update.
	 */

	canvasSizeMultiplier: 1, // Multiplier of the canvas size (If set to 2 - canvas size (not canvas dimetions on the page) will be 2x the image size, therefore drawing quality would be 2x better)

	plusCircleStrokeColor: 'rgba(255, 255, 255, 0.5)', // Color of the plus circle stroke
	plusCircleStrokeColorHover: 'rgba(255, 255, 255, 0.6)', // Color of the plus circle stroke when hovered
	plusCircleFillColor: 'rgba(255, 255, 255, 0.2)', // Color of the plus circle fill
	plusCircleFillColorHover: 'rgba(255, 255, 255, 0.4)', // Color of the plus circle fill when hovered
	plusCircleRadius: 10, // Radius of the plus circle
	plusCircleLineWidth: 2, // Width of the plus circle stroke

	plusIconLineWidth: 2, // Width of the plus icon stroke
	plusIconWidth: 5, // Number of pixels of the plus icon radius
	plusIconStrokeColor: 'rgba(255, 255, 255, 0.7)', // Color of the plus icon stroke
	plusIconStrokeColorHover: 'rgba(255, 255, 255, 0.8)', // Color of the plus icon stroke when hovered

	rectangleFrames: 10, // Number of frames for the rectangle to appear
	rectangleCircleRadius: 10, // Corner radius of the rectangle
	rectangleSublineLength: 10, // Length of the subline of the rectangle (lines that go beyond the corner arc)
	rectangleStrokeColor: 'rgba(255, 255, 255, 1)', // Color of the rectangle stroke
	rectangleLineWidth: 2, // Width of the rectangle strokeÏ
})
```

Set items to be displayed on the image:

```js
il.setItems([
	{
		item: 'item1', // any data that you want to receive in click callback
		pos: {
			x1: 100, // top left x coordinate
			x2: 200, // bottom right x coordinate
			y1: 100, // top left y coordinate
			y2: 200, // bottom right y coordinate
		},
	},
	{
		/* other items */
	},
])
```

Set callback to be executed when user clicks on any item:

```js
il.setClickCallback((item) => {
	console.log('Click on', item)

	// In our case item would be "item1"
})
```

Init ImageLens:

```js
il.init()

// ✨ Now you image became an ImageLens instance 🎉
```

[Optional] Intead of setting everything above individually you could utilize any of the following approaches:

```js
new ImageLens()
	.setImageId('image1')
	.setConfig({
		/* config */
	})
	.setItems([
		/* items */
	])
	.setClickCallback((item) => {
		/* callback */
	})
	.init()
```

```js
new ImageLens().init(
	'image1',
	{
		/* config */
	},
	[
		/* items */
	],
	(item) => {
		/* callback */
	}
)
```

## Release history

All release history with appropriate changelogs could be found on the [Release Page](https://github.com/image-lens/image-lens/releases).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

[contributors-shield]: https://img.shields.io/github/contributors/image-lens/image-lens?style=for-the-badge
[contributors-url]: https://github.com/image-lens/image-lens/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/image-lens/image-lens?style=for-the-badge
[forks-url]: https://github.com/image-lens/image-lens/network/members
[stars-shield]: https://img.shields.io/github/stars/image-lens/image-lens?style=for-the-badge
[stars-url]: https://github.com/image-lens/image-lens/stargazers
[issues-shield]: https://img.shields.io/github/issues/image-lens/image-lens?style=for-the-badge
[issues-url]: https://github.com/image-lens/image-lens/issues
[license-shield]: https://img.shields.io/github/license/image-lens/image-lens?style=for-the-badge
[license-url]: https://github.com/image-lens/image-lens/blob/master/LICENSE
