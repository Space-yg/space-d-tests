/**
 * Check if a type is true
 * 
 * @template T The type to check if it is true
 */
type IsTrue<T extends boolean> =
	[T] extends [true]
		? T extends never
			? false
			: true
		: false
type testIsTrue1 = IsTrue<true> // true
type testIsTrue2 = IsTrue<false> // false
type testIsTrue3 = IsTrue<never> // false
type testIsTrue4 = IsTrue<boolean> // false

export default IsTrue