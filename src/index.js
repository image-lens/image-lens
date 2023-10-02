import ImageLens from './ImageLens'

// @ts-ignore
ImageLens.default = ImageLens

if (typeof window !== 'undefined') {
	console.log('')
	console.log(
		`%c✨ ImageLens v${ImageLens.version}`,
		'color: black; background: white; font-size: 1.5em; padding: 0.25rem; margin: 0.5rem 0; border-radius: 4px; text-shadow: 1px 1px 0 #fffedd;'
	)
	console.log('')
}

export default ImageLens
