# Space-d-tests

Testing framework for your TypeScript types.

## Goals

Some TypeScript type testing libraries have their own purposes, such as [Vitest](https://vitest.dev/), which lets you test types in Vite applications and can be used similar to [Chai](https://www.chaijs.com/); [tsd](https://github.com/tsdjs/tsd), which lets you test types, but uses `test-d.ts` files and you use built-in functions instead of types to assert your types; and many more libraries.

The Space-d-tests framework lets you test your TypeScript types using only `.d.ts` file and using built-in types to type-check your types (say that 5 times).

## Progress

Here is the progress so far for the project. If you want to request a feature or help in the development, make sure to [open an issue](https://github.com/Space-yg/space-d-tests/issues/new)!

Feature																									| Done
--------------------------------------------------------------------------------------------------------|------
Type checking one `.d.ts` file																			| ✅
Type checking multiple `.d.ts` files																	| ✅
Run through command line only																			| ✅
Compatible with custom `tsconfig.json` files															| ✅
Printing custom Errors																					| ✅
Include suite name in the error																			| ❌
Add description to a suite																				| ❌
Add a success message for all the files that were successful											| ❌
Add a "no tests" message for each file with no tests													| ❌
When type checking, ignore the built-in types and make the type checking errors shorter					| ❌
Test with different versions of TypeScript																| ❌
Add configurations through `space-d-tests.config.mts`/`cts`/`js`/`mjs`/`cjs`/`json` and `package.json`	| ❌

The following features _may_ or _may not_ be added:

Feature				| Done
--------------------|------
Customizing errors	| ❌

## How to use

### Installation

Install the framework:

Package manager	| Installation
----------------|--------------
npm				| `npm i -D space-d-tests`
pnpm			| `pnpm add -D space-d-tests`
yarn			| `yarn add -D space-d-tests`

### Setup

The following files are needed at the root of the project:

- A tsconfig (recommended to be a separate tsconfig from the application and named `tsconfig.test.json`).

It is recommended to have a folder called `tests` which will include all your tests. Make sure that the tsconfig [includes](https://www.typescriptlang.org/tsconfig/include.html) the folder.

### Test Cases

To add a test suites and add the test cases, the test suites needs to be in the following structure in any of the files included by the tsconfig:

```ts
type SuiteName = {
	/* Variables used in the tests here */

	tests: [/* Tests here */]
}
```

Here is an example of a test suite:

```ts
import { Expect, MatchObject } from "space-d-tests"

type Never<T extends object> = {
	[K in keyof T]?: never
}

type Suite1 = {
	a: {
		name: string
		age: number
	}
	b: {
		name?: never
		age?: never
	}
	tests: [
		Expect<MatchObject<Never<{ a: number }>, { a?: never }>>, // true
		Expect<MatchObject<Never<Suite1["a"]>, Suite1["b"]>>, // true
	]
}
```

### Running the framework

To test your types, run the following in your terminal (make sure you are in the same directory as the project you want to test):

```cmd
space-d-tests
```

## Configuration

There are currently two ways to set the configurations of the Space-d-tests framework: [CLI](#cli) and [`space-d-tests.config.ts`](#space-d-testsconfigts-configuration) file.

### CLI Configuration

The following options are available to be used in the CLI:

#### `--tsconfig`

The tsconfig file to use.

#### `--basePath`

The base path to resolve the tsconfig file.

### `space-d-tests.config.ts` Configuration

Create a `space-d-tests.config.ts` file in the root of your project. Then import the `defineConfig` function from `space-d-tests/config` and export default by calling it. For example:

```ts
import { defineConfig } from "space-d-tests/config"

export default defineConfig({
	/* Configurations here */
})
```

The following are the available properties to be passed in to the `defineConfig` function:

```ts
interface Config {
	/** The tsconfig to use */
	tsconfig: string
	/** The base path used to find the tsconfig */
	basePath: string
}
```

### Precedence

The following is the precedence of how the configurations are applied (from most significance to least significance):

- CLI
- `space-d-tests.config.ts`

For example, if in the `space-d-tests.config.ts` you defined the following:

```ts
import { defineConfig } from "space-d-tests/config"

export default defineConfig({
	tsconfig: "tsconfig.test.json"
})
```

And you execute the following command:

```cmd
space-d-tests --tsconfig tsconfig.json
```

The CLI configurations will override the `space-d-tests.config.ts` configurations. Meaning, the framework will use the `tsconfig.json` that is passed by the CLI and not the `tsconfig.test.json` that is defined in the `space-d-tests.config.ts` file.