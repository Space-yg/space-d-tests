import type { ObjectLike } from "./helpers"

/**
 * Check if an object is object-like
 * 
 * Object-likes are objects such as the following:
 * ```ts
 * {}
 * { a: string, b?: number }
 * ["hi"]
 * [1, 2, "3!"]
 * ```
 * 
 * Objects-likes are NOT the following:
 * ```ts
 * "hi"
 * 123
 * () => void
 * ```
 * 
 * @template T The object to check if it is object-like
 */
type IsObjectLike<T extends object> = T extends ObjectLike ? true : false

type test = IsObjectLike<[]>

export default IsObjectLike