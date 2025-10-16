# @ezez/utils

> Formerly: bottom-line-utils, but I never liked the name

A tiny and fast utils library.

## Documentation

Documentation can be found here: [documentation](https://ezez.dev/docs/utils/latest).

## Installing

`npm install @ezez/utils`

## Motivation

Lodash complexity that causes big bundle sizes just for using single function (even with tree shaking!).

Lodash is trying to cover each possible use case, even very rare while typical observed use case of lodash is basic
methods used on basic data. As an example, let's take a `_.pick` method that simply returns an object, based on source
object, with just some properties copied. Easy, right? Few lines of code? Lodash makes that 114 imports!

`@ezez/utils` aims to:
- cover only most typical use cases of given functions,
- add useful methods that are missing in lodash,
- NOT being 100% compatible replacement for lodash/underscore, while keeping MOST behavior identical,
- not being a "polyfill" (no `map`/`forEach` functions etc.),
- perform fast and have code size small.

## Supported methods

### String related
- `capitalize` - capitalize a string, optionally lower casing the rest
- `ensurePrefix` - add prefix to a string if not already present
- `ensureSuffix` - add suffix to a string if not already present
- `isNumericString` - check if given value is a numeric string, features configurable
- `occurrences` - count occurrences of a substring in a string, optionally allow overlapping
- `replace` - replace all occurrences of a substring using a map of replacements
- `stripPrefix` - strip prefix from a string
- `stripSuffix` - strip suffix from a string
- `trim` - remove given characters from both sides of a string
- `trimEnd` - remove given characters from the end of a string
- `trimStart` - remove given characters from the start of a string

### Number related
- `cap` - cap a value between lower and upper bound
- `round` - round a value to given precision
- `scale` - scale given value from old range to new range

### Array related
- `compareArrays` - compare two arrays
- `ensureArray` - ensure that given value is an array
- `insertSeparator` - insert a separator between every character in an array
- `last` - get last element of an array
- `match` - split your array into two groups - one that matches given predicate, and one that doesn't
- `mostFrequent` - find most frequent value in an array
- `pull` - remove values from an array (by mutating)
- `remove` - remove values from an array (by mutating) using predicate function and return removed values
- `sample` - pick a random element from an array
- `samples` - pick multiple random elements from an array without duplicates
- `shuffle` - shuffle an array, returning a new array
- `sortBy` - sort an array by given property (create callback function for `Array.prototype.sort`)
- `sortByMultiple` - sort an array by multiple properties with individual sort directions
- `toggle` - toggle an item in an array (add if missing, remove if present)
- `unique` - get unique values from an array

### Object related
- `compareProps` - compare two objects and return list of different properties
- `deserialize` - deserialize values serialized with `serialize`
- `isPlainObject` - check if given value is a plain object
- `mapValues` - map values of an object
- `merge` - merge two objects shallowly, allowing to remove properties while doing so
- `omit` - omit properties from an object
- `pick` - pick some properties from an object
- `removeCommonProperties` - remove properties from targets that have the same value as in source
- `replaceDeep` - recursively replace all occurrences of a value in an object/array
- `replaceDeepByFn` - recursively replace values in an object/array using a callback function
- `serialize` - like JSON.stringify but any data type is allowed
- `sortProps` - sort object properties by key

### Date related
- `ensureDate` - ensure that given value is a Date instance
- `ensureTimestamp` - ensure that given value is a numeric timestamp
- `formatDate` - format a date using a format string, syntax from PHP

### Type/data safety
- `coalesce` - return first non-nullish value
- `ensureError` - ensure that given value is an error
- `escapeRegExp` - escape a string to be used in a regular expression
- `safe` - runs function and returns its result or default value if function throws an error
- `hasProps` - runtime check and type guard to ensure that given object has specified properties
- `assertProps` - like `hasProps` but throws if check fails

### Flow related
- `ignore` - execute a callback and ignore its result, errors, or promise rejections
- `later` - create a promise you can resolve later, outside of Promise constructor
- `mapAsync` - map an array asynchronously if sync version blocks your event loop for too long
- `noop` - do nothing
- `race` - timeout your promises while keeping TypeScript types correct
- `rethrow` - throw given value
- `retry` - execute Promise-returning in a loop until it resolves
- `seq` - sequentially execute Promise-returning functions until one returns a value
- `wait` - wait given amount of time (async)
- `waitFor` - wait for a condition to be true, checking every given amount of time
- `waitSync` - wait given amount of time (sync)

### Various
- `get` - extract a value from a deep object using specified path, optionally with a default value
- `getMultiple` - same as above, but test multiple paths
- `isEmpty` - check if given value is empty
- `memoize` - memoize a function, caching the result of the last call
- `set` - set a value in a deep object using specified path
- `setImmutable` - set a value in a deep object using specified path, but return a new object
- `throttle` - throttle a function, very configurable
- `truthy` - is value truthy? (useful for filtering with more correct TypeScript support than `filter(Boolean)`)

Methods will be added as I need them. I am open for suggestions and PRs. See next heading for list of methods that I
want to add.

## Methods to be supported

(TODO)
- debounce

## Tested

This library is fully unit tested and can be used on production. See License.

## License

MIT
