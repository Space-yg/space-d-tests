import ts from "typescript"
import { errorLine } from "./print"
import type { Options } from "./types"

/**
 * Check if a node evaluates to a `true` type
 * @param node The node to check
 * @param options The options of the runner
 * @returns Whether the node evaluates to a `true` type
 */
function checkTrueType(node: ts.TypeReferenceNode | ts.LiteralTypeNode | ts.ConditionalTypeNode, options: Options): boolean {
	const type = options.checker.getTypeFromTypeNode(node)

	// Checks if the element evaluates to a boolean literal
	const typeString = options.checker.typeToString(type)
	if ((type.flags & ts.TypeFlags.BooleanLiteral) !== ts.TypeFlags.BooleanLiteral) {
		errorLine(node, `Type "${typeString}" does not evaluate to a boolean literal.`)
		return false
	}

	// Check if each element is true
	if (typeString !== "true") {
		errorLine(node, `Type ${typeString} is not true.`)
		return false
	}

	return true
}

/**
 * Check if all the elements in the tests tuple node are `true`
 * @param node The node to check
 * @param options The options of the runner
 */
function checkTests(node: ts.TupleTypeNode, options: Options) {
	// Check each element in the tuple
	node.elements.forEach(element => {
		// Check that the element is a type reference
		if (!ts.isLiteralTypeNode(element) && !ts.isConditionalTypeNode(element) && !ts.isTypeReferenceNode(element)) {
			errorLine(element, `This (${ts.SyntaxKind[element.kind]}) is not a literal type, conditional type, or a type reference`)
			return
		}

		if (options.debug) {
			console.log("Kind:", ts.SyntaxKind[element.kind])
		}

		checkTrueType(element, options)
	})
}

/**
 * Check if the member is the "tests" member
 * @param member The member to check
 * @param options The options of the runner
 * @returns Whether this was the "tests" member. `true` if it was the "tests" member, `false` if it is not
 */
function checkMemberTest(member: ts.TypeElement, options: Options): boolean {
	// For typing
	if (!ts.isPropertySignature(member)) return false
	if (!ts.isIdentifier(member.name) && !ts.isStringLiteral(member.name)) return false
	// Only check the "tests" property
	if (member.name.text !== "tests") return false

	if (options.debug) {
		console.log(`"tests" member`)
		console.log("Name kind:", ts.SyntaxKind[member.name.kind])
		console.log()
	}

	// Make sure that the type exists
	if (typeof member.type === "undefined") {
		errorLine(member, `"tests" does not have a type.`)
		return true
	}
	// Make sure that the type is a tuple
	if (!ts.isTupleTypeNode(member.type)) {
		errorLine(member.type, `"tests" should be a tuple.`)
		return true
	}

	if (options.debug) {
		console.log("Tuple")
		console.log("Kind:", ts.SyntaxKind[member.type.kind])
	}

	// Check the tests
	checkTests(member.type, options)

	return true
}

/**
 * Visit a node and check if it is in the following structure
 * ```ts
 * type Name = {
 *     tests: []
 * }
 * ```
 * @param node The node to visit
 * @param options The options of the runner
 */
function visitNode(node: ts.Node, options: Options) {
	// if (
	// 	ts.isInterfaceDeclaration(node) ||
	// 	ts.isTypeAliasDeclaration(node) ||
	// 	ts.isClassDeclaration(node) ||
	// 	ts.isEnumDeclaration(node)
	// ) {
	// 	const name = node.name?.text
	// 	console.log(`${ts.SyntaxKind[node.kind]}: ${name}`)
	// }

	/**
	 * Make sure that it is
	 * ```ts
	 * type Name = {
	 *     tests: []
	 * }
	 * ```
	 */
	if (
		// Check if node is a type
		ts.isTypeAliasDeclaration(node) &&
		// Check if the type is {}
		ts.isTypeLiteralNode(node.type) &&
		// Check if there are members in the object
		node.type.members.length >= 1
	) {
		if (options.debug) {
			console.log("Node")
			console.log("Name:", node.name?.text)
			console.log("Kind:", ts.SyntaxKind[node.kind])
			console.log()

			console.log("Type")
			console.log("Kind:", ts.SyntaxKind[node.type.kind])
			console.log()
		}

		// Check each member of the object
		for (const member of node.type.members) {
			if (checkMemberTest(member, options)) break
		}
	}

	// Visit each node in the children
	// ts.forEachChild(node, child => visitNode(child, options))
}

export function checkTSConfig(basePath: string, tsconfigName: string): void {
	// Config
	const configPath = ts.findConfigFile(basePath, ts.sys.fileExists, tsconfigName)
	if (typeof configPath === "undefined") return console.error(`Config file "${tsconfigName}" does not exist`)
	const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
	const parsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, basePath)

	// Program
	const program = ts.createProgram({
		rootNames: parsedCommandLine.fileNames,
		options: parsedCommandLine.options,
	})

	// Checker
	const checker = program.getTypeChecker()

	// Source
	const sourceFiles = program.getSourceFiles()
	if (sourceFiles.length === 0) return console.error(`No source files found from the config file "${tsconfigName}".`)

	// All the errors
	const allDiagnostics: ts.Diagnostic[] = []
	for (const sourceFile of sourceFiles) allDiagnostics.push(...program.getSyntacticDiagnostics(sourceFile), ...program.getSemanticDiagnostics(sourceFile), ...program.getDeclarationDiagnostics(sourceFile))
	// for (const diagnostic of allDiagnostics) {
	// 	errorLine(diagnostic.start!, diagnostic.start! + diagnostic.length!, diagnostic.file!, diagnostic.messageText.toString())
	// }

	// console.log(ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
	// 	getCanonicalFileName: f => f,
	// 	getCurrentDirectory: () => process.cwd(),
	// 	getNewLine: () => "\n",
	// }));

	// For every source file
	for (const sourceFile of sourceFiles) {
		// For each node in the source file, visit the node
		sourceFile.forEachChild(child => visitNode(child, { checker, sourceFile, debug: false }))
	}
}

// checkTSConfig("./", "tsconfig.test.json")