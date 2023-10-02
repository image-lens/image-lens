import { readFileSync } from 'fs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(readFileSync('package.json'))
const version = process.env.VERSION || packageJson.version

const banner = `/*!
* ImageLens v${version}
* GitHub: ${packageJson.homepage}
* Released under the ${packageJson.license} License.
* (c) ${new Date().getFullYear()} ${packageJson.author}
*/`

const footer = ``

const output = {
	format: 'umd',
	name: 'ImageLens',
	file: 'dist/ImageLens.js',
	banner,
	footer,
}

export default {
	plugins: [
		babel({
			babelHelpers: 'bundled',
			presets: [
				[
					'@babel/preset-env',
					{
						targets: '> 0.25%, last 2 versions, Firefox ESR, not dead',
					},
				],
			],
		}),
	],
	input: 'src/index.js',
	output: [
		output,
		{
			...output,
			file: 'dist/ImageLens.min.js',
			plugins: [terser()],
		},
	],
	// https://github.com/rollup/rollup/issues/2271
	onwarn(warning, rollupWarn) {
		if (warning.code !== 'CIRCULAR_DEPENDENCY' && warning.code !== 'THIS_IS_UNDEFINED') {
			rollupWarn(warning)
		}
	},
}
