#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`1. Set version ...`
const packageJson = JSON.parse(await fs.readFile('package.json'))

// replace version = '%d.%d.%d' in src/ImageLens.js
const imageLensJs = await fs.readFile('src/ImageLens.js', 'utf8')
await fs.writeFile(
	'src/ImageLens.js',
	imageLensJs.replace(/version = '\d+\.\d+\.\d+'/m, `version = '${packageJson.version}'`)
)

// replace v%d.%d.%d in README.md
const readmeMd = await fs.readFile('README.md', 'utf8')
let newReadmeMd = readmeMd.replace(/v\d+\.\d+\.\d+/m, `v${packageJson.version}`)

// replace jsDelivr version in README.md
newReadmeMd = newReadmeMd.replace(
	/<script src="https:\/\/cdn\.jsdelivr\.net\/.+"><\/script>/m,
	`<script src="https://cdn.jsdelivr.net/gh/image-lens/image-lens@v${packageJson.version}/dist/ImageLens.min.js"></script>`
)
await fs.writeFile('README.md', newReadmeMd)
echo``

echo`1. Build JS ...`
await $`rollup -c --bundleConfigAsCjs`
echo``
