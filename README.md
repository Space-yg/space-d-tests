# Space.d.test

Testing framework for your TypeScript types.

## Goals

Some TypeScript type testing libraries have their own purposes, such as [Vitest](https://vitest.dev/), which lets you test types in Vite applications and can be used similar to [Chai](https://www.chaijs.com/); [tsd](https://github.com/tsdjs/tsd), which lets you test types, but uses `test-d.ts` files and you use built-in functions instead of types to assert your types; and many more libraries.

The Space.d.test framework lets you test your TypeScript types using only `.d.ts` file and using built-in types to type-check your types (say that 5 times).

## Progress

Here is the progress so far for the project. If you want to request a feature or help in the development, make sure to open an issue!

Feature																					| Done
----------------------------------------------------------------------------------------|------
Type checking one `.d.ts` file															| ✅
Type checking multiple `.d.ts` files													| ✅
Run through command line only															| ✅
Compatible with custom `tsconfig.json` files											| ✅
Printing custom Errors																	| ✅
When type checking, ignore the built-in types and make the type checking errors shorter	| ❌

The following features _may_ or _may not_ be added:

Feature				| Done
--------------------|------
Customizing errors	| ❌