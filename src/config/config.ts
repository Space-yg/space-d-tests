import type { Config } from "./types"
import fs from "fs"

/** The default configurations */
export const defaultConfig: Config = {
	basePath: "./",
	tsconfig: "tsconfig.test.json",
} as const

/**
 * Define the configurations for the space-d-tests framework
 * @param config The configurations
 * @returns The same configurations
 */
export function defineConfig<T extends Partial<Config>>(config: T): T {
	return config
}

/**
 * Setup the default configurations
 * @param cwd The current working directory
 * @returns A reference to the default configurations
 */
function setupDefaultConfig(cwd: string): Config {
	// Check if tsconfig.test.json and tsconfig.json exist
	if (fs.existsSync(cwd + "\\tsconfig.test.json")) defaultConfig.tsconfig = "tsconfig.test.json"
	else if (fs.existsSync(cwd + "\\tsconfig.json")) defaultConfig.tsconfig = "tsconfig.json"
	// So that it could outputs an error later
	else defaultConfig.tsconfig = "tsconfig.test.json"

	return defaultConfig
}

/**
 * Setup the configurations for the space-d-test framework
 * @param cwd The current working directory. Usually it's `process.cwd()`
 * @returns The configurations
 */
export function setupConfig(cwd: string): Config {
	setupDefaultConfig(cwd)

	try {
		// Try to get configuration
		const { default: config } = require(cwd + "\\space-d-tests.config.ts")

		// Add the undefined configurations
		for (const key in defaultConfig) if (typeof config[key] === "undefined") config[key] = defaultConfig[key as keyof Config]

		return config
	} catch {
		// Return default configurations if it couldn't require the file
		return defaultConfig
	}
}