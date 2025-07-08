import type Match from "./Match"
import type All from "./All"
import type { ObjectLike } from "./helpers"

/**
 * Check if all the types of each property in two objects match. This does not look into optional keys or readonlys
 * 
 * @template T The first object to check
 * @template U The second object to check
 * 
 * @returns `true` if the types of each property in two objects match; `false` otherwise
 */
type MatchTypes<T extends ObjectLike, U extends ObjectLike> = All<[{
	[K in keyof T]: Match<T[K], U[K]>
}[keyof T], {
	[K in keyof U]: Match<U[K], T[K]>
}[keyof U]]>

type t = MatchTypes<{ a: number, b: string }, { a: number, b: string }>

export default MatchTypes