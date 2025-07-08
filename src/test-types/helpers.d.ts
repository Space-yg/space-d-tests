/**
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
 */
export type ObjectLike = {
	[key: string | symbol | number]: any
}