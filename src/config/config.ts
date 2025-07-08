import type { Config } from "./types"

/** The default configurations */
export const defaultConfig: Config = {
	basePath: "./",
	tsconfig: "tsconfig.json",
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
 * Setup the configurations for the space-d-test framework
 * @param cwd The current working directory. Usually it's `process.cwd()`
 * @returns The configurations
 */
export function setupConfig(cwd: string): Config {
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