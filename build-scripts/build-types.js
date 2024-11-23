import 'zx/globals'

import { inspect } from 'util'
import ts from 'typescript'

function buildDeclarationFiles(fileNames, options) {
	options = {
		...options,
		declaration: true,
		emitDeclarationOnly: true,
		outDir: './dist/',
	}
	const program = ts.createProgram(fileNames, options)
	program.emit()
}

const tsconfig = ts.readConfigFile('./tsconfig.json', ts.sys.readFile)
if (tsconfig.error) throw new Error(`failed to read tsconfig: ${inspect(tsconfig)}`)

buildDeclarationFiles([
    './src/index.ts'
], tsconfig.config)