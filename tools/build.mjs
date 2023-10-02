#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`1. Set version ...`
const packageJson = JSON.parse(await fs.readFile('package.json'))

// replace {{version}} in src/ImageLens.js
const imageLensJs = await fs.readFile('src/ImageLens.js', 'utf8')
await fs.writeFile('src/ImageLens.js', imageLensJs.replace('{{version}}', packageJson.version))

// replace {{version}} in README.md
const readmeMd = await fs.readFile('README.md', 'utf8')
await fs.writeFile('README.md', readmeMd.replace('{{version}}', packageJson.version))
echo``

echo`1. Build JS ...`
await $`rollup -c --bundleConfigAsCjs`
echo``
