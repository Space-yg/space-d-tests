import type Match from "./Match"

/**
 * Check if two object types match
 * 
 * @template T The first object type to check
 * @template U The second object type to check
 * 
 * @returns `true` if the object types match; `false` otherwise
 */
type MatchObject<T extends object, U extends object> =
	Match<keyof T, keyof U> extends true // Matches the keys
		? Match<T, U> extends true // Matches the types
			? true
			: false
		: false

export default MatchObject