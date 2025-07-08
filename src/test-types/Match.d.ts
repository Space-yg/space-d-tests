/**
 * Check if two types match
 * 
 * @template T The first type to check
 * @template U The second type to check
 * 
 * @returns `true` if the types match; `false` otherwise
 */
type Match<T, U> =
	[T] extends [U]
		? [U] extends [T]
			? true
			: false
		: false

export default Match