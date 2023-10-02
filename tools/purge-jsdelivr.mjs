#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`Purge jsdelivr cache...`

const distFiles = fs.readdirSync('dist')
const packageJson = JSON.parse(await fs.readFile('package.json'))

echo` - ${packageJson.version}`
await $`curl --silent https://purge.jsdelivr.net/gh/kirillovmr/image-lens@${packageJson.version}/`
await $`curl --silent https://purge.jsdelivr.net/gh/kirillovmr/image-lens@v${packageJson.version}/`

// dist
for (const distFile of distFiles) {
	if (distFile === '.DS_Store') continue
	echo`   - dist/${distFile}`
	await $`curl --silent https://purge.jsdelivr.net/gh/kirillovmr/image-lens@${packageJson.version}/dist/${distFile}`
	await $`curl --silent https://purge.jsdelivr.net/gh/kirillovmr/image-lens@v${packageJson.version}/dist/${distFile}`
}

echo`OK!`
