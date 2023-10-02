#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`1. Build JS ...`
await $`rollup -c --bundleConfigAsCjs`
echo``
