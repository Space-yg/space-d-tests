/**
 * Check if a type is false
 * 
 * @template T The type to check if it is false
 */
type IsFalse<T extends boolean> =
	[T] extends [false]
		? T extends never
			? false
			: true
		: false
type testIsFalse1 = IsFalse<true> // false
type testIsFalse2 = IsFalse<false> // true
type testIsFalse3 = IsFalse<never> // false
type testIsFalse4 = IsFalse<boolean> // false

export default IsFalse