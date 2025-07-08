import ts from "typescript"

/**
 * Get the text at a line in a source file
 * @param line The line to get from the source file
 * @param sourceFile The source file to get the text from
 * @returns The text at the line
 */
function getLineText(line: number, sourceFile: ts.SourceFile): string {
	return sourceFile.text.split(/\r?\n/)[line]
}

/**
 * Replace the beginning tabs with spaces of a text
 * @param text The text to replace the beginning tabs with spaces
 * @returns 
 */
function replaceBeginningTabsWithSpaces(text: string): {
	/** The new text with the replaced tabs */
	text: string
	/** The old number of spaces at the beginning of the text */
	oldTotalSpaces: number
	/** The new number of spaces at the beginning of the text */
	newTotalSpaces: number
} {
	let newText = ""
	let newTotalSpaces = 0
	let i = 0
	for (; i < text.length; i++) {
		// Replace \t
		if (text[i] === "\t") {
			newText += "  "
			newTotalSpaces += 2
		}
		// Skip " "
		else if (text[i] === " ") {
			newText += text[i]
			newTotalSpaces++
		}
		// Break for any other character
		else break
	}
	newText += text.slice(i)

	return {
		text: newText,
		oldTotalSpaces: i,
		newTotalSpaces
	}
}

/**
 * Makes a line from a source file to be used for printing
 * @param line The line to get
 * @param sourceFile The source file to get from
 */
export function makeLine(line: number, sourceFile: ts.SourceFile): {
	/** The text that is created for printing */
	text: string
	/** The new line (without the line number) */
	line: string
	/** The old number of spaces at the beginning of the text */
	oldTotalSpaces: number
	/** The new number of spaces at the beginning of the text */
	newTotalSpaces: number
} {
	const { text, oldTotalSpaces, newTotalSpaces } = replaceBeginningTabsWithSpaces(getLineText(line, sourceFile))
	const lineText = (line + 1).toString() + "  " + text

	return {
		text: lineText,
		line: text,
		oldTotalSpaces,
		newTotalSpaces,
	}
}

/**
 * Create the error at at or after a particular node
 * @param node The node to create the error for
 * @param linesAfter The lines at or after to create the error at
 * @param error The error message
 * @returns The error
 */
function errorAtLine(start: number, end: number, sourceFile: ts.SourceFile, linesAfter: number, error?: string): string {
	let output = ""

	// Get the line number and the character number of the node
	const lineAndCharacter = ts.getLineAndCharacterOfPosition(
		sourceFile,
		start
	)

	const endLineAndCharacter = ts.getLineAndCharacterOfPosition(sourceFile, end)

	// Add line
	const { text, line: afterText, newTotalSpaces, oldTotalSpaces } = makeLine(lineAndCharacter.line + linesAfter, sourceFile)
	output += text

	// Check if the error continues to this line
	if (endLineAndCharacter.line >= lineAndCharacter.line + linesAfter) {
		// Add ⋮ if there are more lines after current
		const numberReplacement = lineAndCharacter.line + 1 + linesAfter < sourceFile.text.split(/\r?\n/).length
			? " ".repeat((lineAndCharacter.line + 1 + linesAfter).toString().length - 1) + "⋮"
			: " ".repeat((lineAndCharacter.line + 1 + linesAfter).toString().length)

		const errorAtSpaces =
			+ 2 // Spaces after line number ("  ")
			+ (newTotalSpaces - oldTotalSpaces) // Added edited spaces
			+ oldTotalSpaces // Add place of character

		// Add ~
		output +=
			"\n" +
			numberReplacement +
			" ".repeat(2 + newTotalSpaces) +
			"\x1b[0;31m" + // Red color
			"~".repeat(
				endLineAndCharacter.line !== lineAndCharacter.line + linesAfter
					? afterText.length - errorAtSpaces + 2
					: end - ts.getPositionOfLineAndCharacter(sourceFile, lineAndCharacter.line + linesAfter, oldTotalSpaces)
			) +
			"\x1b[0m" // Reset color

		// Add error
		if (typeof error !== "undefined") output += "\n" + numberReplacement + " ".repeat(errorAtSpaces) + "\x1b[0;31m" + error + "\x1b[0m"
	}

	return output
}

function errorLineHelper(start: number, end: number, sourceFile: ts.SourceFile, error: string, print: boolean = true): string {
	let output = ""
	
	// Get the line number and the character number of the node
	const lineAndCharacter = ts.getLineAndCharacterOfPosition(
		sourceFile,
		start
	)
	
	// File
	output += `\x1b[0;96m${sourceFile.fileName}\x1b[0m:\x1b[0;33m${lineAndCharacter.line + 1}\x1b[0m:\x1b[0;33m${lineAndCharacter.character + 1}\x1b[0m`
	
	// Previous lines
	if (lineAndCharacter.line - 2 !== 0) output += "\n" + makeLine(lineAndCharacter.line - 2, sourceFile).text
	if (lineAndCharacter.line - 1 !== 0) output += "\n" + makeLine(lineAndCharacter.line - 1, sourceFile).text
	
	// Current Line
	output += "\n" + errorAtLine(start, end, sourceFile, 0, error)
	
	// Next lines
	if (lineAndCharacter.line + 1 < sourceFile.text.split(/\r?\n/).length) output += "\n" + errorAtLine(start, end, sourceFile, 1)
	if (lineAndCharacter.line + 2 < sourceFile.text.split(/\r?\n/).length) output += "\n" + errorAtLine(start, end, sourceFile, 2)
	
	// Print
	if (print) console.log(output + "\n")
	
	return output
}

/**
 * Create an error from start to end in a source file
 * @param start 
 * @param end 
 * @param sourceFile 
 * @param error 
 * @param print 
 */
export function errorLine(start: number, end: number, sourceFile: ts.SourceFile, error: string, print?: boolean): string
/**
 * Create an error at a node
 * @param node The node to create the error at
 * @param error The error to add to it
 * @param print Whether to print the error
 */
export function errorLine(node: ts.Node, error: string, print?: boolean): string
export function errorLine(nodeOrStart: ts.Node | number, errorOrEnd: string | number, printOrSourceFile?: boolean | ts.SourceFile, error?: string, print?: boolean): string {
	if (typeof nodeOrStart === "number") {
		// Just to make typescript happy
		if (typeof errorOrEnd !== "number") throw new TypeError("Cannot mix between different function signatures.")
		if (typeof printOrSourceFile !== "object") throw new TypeError("Cannot mix between different function signatures.")
				
		return errorLineHelper(nodeOrStart, errorOrEnd, printOrSourceFile, error!, print)
	} else {
		// Just to make typescript happy
		if (typeof errorOrEnd !== "string") throw new TypeError("Cannot mix between different function signatures.")
		if (typeof printOrSourceFile === "object") throw new TypeError("Cannot mix between different function signatures.")
		
		return errorLineHelper(nodeOrStart.getStart(), nodeOrStart.end, nodeOrStart.getSourceFile(), errorOrEnd, printOrSourceFile)
	}
}