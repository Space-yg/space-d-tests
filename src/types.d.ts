import ts from "typescript"

/** The options for the runner */
export type Options = {
	/** The TypeScript checker */
	checker: ts.TypeChecker
	/** The source file */
	sourceFile: ts.SourceFile
	/** Whether to run in debug mode */
	debug: boolean
}