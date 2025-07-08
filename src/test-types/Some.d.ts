import type IsTrue from "./IsTrue"

/**
 * Checks if any of the elements in an array are true
 * 
 * @template T The array to check if any element is true
 */
type Some<T extends boolean[]> = {
	[K in keyof T]: IsTrue<T[K]>
} extends false[] ? false : true

type testSome1 = Some<[true, true]> // true
type testSome2 = Some<[true, false]> // true
type testSome3 = Some<[true, boolean]> // true
type testSome4 = Some<[true, never]> // true
type testSome5 = Some<[never, never]> // false
type testSome6 = Some<[false, false]> // false
type testSome7 = Some<[boolean, boolean]> // false
type testSome8 = Some<[boolean, false]> // false

export default Some