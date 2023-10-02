#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`Purge jsdelivr cache...`

const distFiles = fs.readdirSync('dist')
const packageJson = JSON.parse(await fs.readFile('package.json'))

await $`curl --silent https://purge.jsdelivr.net/gh/image-lens/image-lens/`

echo` - ${packageJson.version}`
await $`curl --silent https://purge.jsdelivr.net/gh/image-lens/image-lens@${packageJson.version}/`
await $`curl --silent https://purge.jsdelivr.net/gh/image-lens/image-lens@v${packageJson.version}/`

// dist
for (const distFile of distFiles) {
	if (distFile === '.DS_Store') continue
	echo`   - dist/${distFile}`
	await $`curl --silent https://purge.jsdelivr.net/gh/image-lens/image-lens@${packageJson.version}/dist/${distFile}`
	await $`curl --silent https://purge.jsdelivr.net/gh/image-lens/image-lens@v${packageJson.version}/dist/${distFile}`
}

echo`OK!`
