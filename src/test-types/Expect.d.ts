/**
 * Expect a type to be true
 * 
 * @template T The type to expect to be true
 */
type Expect<T extends true> = T

export default Expect