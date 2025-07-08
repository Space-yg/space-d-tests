#!/usr/bin/env node

import { checkTSConfig } from "../runner"
import { setupConfig } from "../config/config"

/**
 * Main function for the cli
 */
function main() {
	// Arguments passed through cli
	const args = process.argv.slice(2)

	// Configuration of the cli
	const config = setupConfig(process.cwd())

	/** All the actions that will be executed in a particular order */
	const actions: Function[] = [() => checkTSConfig(config.basePath, config.tsconfig)]

	// Options to action
	type OptionsToAction = {
		[option: string]: {
			/** The number of options needed after the  */
			values: number
			action: (args: string[]) => void
		}
	}

	const optionsToAction: OptionsToAction = {
		"--tsconfig": {
			values: 1,
			action: (options) => config.tsconfig = options[0]
		},
		"--basePath": {
			values: 1,
			action: (options) => config.basePath = options[0]
		}
	}

	for (let i = 0; i < args.length; i++) {
		if (args[i] in optionsToAction) {
			// Check if there are options after it
			if (i + optionsToAction[args[i]].values >= args.length) {
				console.error(`Not enough values provided (${args.length - i - 1}) for the option "${args[i]}". Needed ${optionsToAction[args[i]].values === 1 ? "1 value" : optionsToAction[args[i]].values + " values"}.`)
				return
			}

			// Execute action
			optionsToAction[args[i]].action(args.slice(i + 1, i + 1 + optionsToAction[args[i]].values))

			// Skip the options
			i += optionsToAction[args[i]].values
		} else {
			console.error(`Unknown option "${args[i]}".`)
			return
		}
	}

	// Execute all actions
	for (const action of actions) action()
}

main()