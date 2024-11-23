import 'zx/globals'

import * as esbuild from 'esbuild'

await fs.rm('./dist/', { force: true, recursive: true })

await Promise.all([
	$`node ./build-scripts/build-types.js`,
	esbuild.build({
		entryPoints:  [
            './src/index.ts'
        ],
		outdir: './dist/',
		logLevel: 'info',
		outExtension: {
			'.js': '.mjs',
		},
		target: 'es2022',
		// platform: 'browser', // Doesn't seem to be needed?
		format: 'esm',
		bundle: true,
		treeShaking: true,
		external: ['node:events', 'node:async_hooks', 'node:buffer'],
	}),
])