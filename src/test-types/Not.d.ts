/**
 * Negates a boolean type
 * 
 * @template T The type to negate
 */
type Not<T extends boolean> = T extends false ? true : false

export default Not