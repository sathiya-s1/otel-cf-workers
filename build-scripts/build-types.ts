import 'zx/globals'

import { inspect } from 'util'
import ts from 'typescript'

function buildDeclarationFiles(fileNames: string[], options: ts.CompilerOptions): void {
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
    './src/index.ts',
    './src/opentelemetry-api.ts'
], tsconfig.config)