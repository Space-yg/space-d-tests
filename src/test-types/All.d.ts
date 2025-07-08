import type IsTrue from "./IsTrue"

/**
 * Check if all elements in an array are true
 * 
 * @template T The array to check if all elements are true
 */
type All<T extends boolean[]> = {
	[K in keyof T]: IsTrue<T[K]>
} extends true[] ? true : false

type testAll1 = All<[true, true]> // true
type testAll2 = All<[true, false]> // false
type testAll3 = All<[true, boolean]> // false
type testAll4 = All<[true, never]> // false

export default All