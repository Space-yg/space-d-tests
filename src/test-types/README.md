# Test Types

Here are the types used for testing.

## Notes about the types

- When there is `[Type1] extends [Type2]`, this is needed because when union types (e.g., `string | number`) are passed in as type parameter into a type (e.g., `Expect<string | number>`), each type in the union is distributed separately as a type into the type parameter, but when you have `[Type1] extends [Type2]`, it uses the entire union as a whole.