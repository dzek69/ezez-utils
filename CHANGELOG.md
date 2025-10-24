All notable changes to this project will be documented in this file.

The format is based on [EZEZ Changelog](https://ezez.dev/changelog/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]
- (nothing yet)

## [4.7.2] - 2025-10-16
### Fixed
- serializeToBuffer misbehaving on multi-byte characters

## [4.7.1] - 2025-10-16
### Fixed
- added missing exports of `hasProps` and `assertProps`

## [4.7.0] - 2025-10-16
### Added
- `hasProps` method
- `assertProps` method
### Changed
- deprecated `match`

## [4.6.0] - 2025-10-10
### Added
- `ignore` method
### Changed
- `ensureError` will now return original error as `cause`
- deprecated `isEmpty`
- better return type of `safe`
- seq will return `cause` on the error (in addition to `details` property, which is no deprecated)
### Dev
- linting chores
- all the functions (except one) has explicit return type

## [4.5.0] - 2025-05-08
### Added
- `serializeToBuffer` method
- `unserializeFromBuffer` method (aliased as `deserializeFromBuffer`)
- `unserialize` alias to `deserialize` method
### Fixed
- `serialize` JSDoc mentioned custom serializer limitation with values with `.toJSON` method that was fixed in 4.0.0

## [4.4.0] - 2025-03-23
### Added
- `sortByMultiple` method
### Dev
- fixed `race` JSDoc

## [4.3.0] - 2025-03-04
### Added
- `race` method

## [4.2.0] - 2025-03-04
### Added
- `retry` method

## [4.1.0] - 2024-05-31
### Fixed
- `sample` adds `undefined` to the result type unless the input is a tuple
- `merge` return type was a basic intersection, which is not a correct way to represent merging
- `waitFor` will reject but call the callback indefinitely if timeout is set without `maxRetries`
### Added
- `memoize` method
### Changed
- every regexp now uses `u` flag, which could positively affect these functions: escapeRegExp, formatDate and isNumericString
- small docs improvements

## [4.0.0] - 2024-05-16
### Breaking
- `replaceDeep` will not mutate anything by default anymore — previously it was wrongly documented as always mutating,
but it was not mutating objects. Mutating behavior can now be enabled and additionally controlled by defining if
instances properties are allowed to be mutated.
- `serialize` to avoid excessive calls to serializer functions - they are now only called with non-plain objects or
unknown data types, this breaks some rare use cases
### Changed
- `serialize` custom serializers now allow things like `Date` (that defines .toJSON) to be supported as the user would
expect
### Added
- `replaceDeepByFn` method for more granular control over replacing values. `replaceDeep` is a simplified wrapper over
the new function
- `trim`, `trimStart`, and `trimEnd` methods
### Dev
- upgraded some jsdocs

## [3.0.0] - 2024-03-25
### Breaking
- `waitFor` method was upgraded:
  - now it supports Promises
  - the check fails only if `undefined`, `null` or `false` is given
  - function signature is changed (object options)
  - `maxTries` option is added to have a limit of tries unrelated to time
  - no wait before the initial check
### Added
- `toggle` method
- `sample` method
- `samples` method
- `shuffle` method
### Dev
- added `waitFor` unit tests
- added missing build files to repo (missing since 2.0.0)

## [2.1.0] - 2023-10-29
### Added
- `round` method

## [2.0.0] - 2023-10-09
### Breaking
- code is compiled to es2020 due to `bigint` usage, if you are not using `serialize` or `deserialize` you can still
transpile this lib yourself
### Added
- `serialize` method
- `deserialize` method
- `replaceDeep` method

## [1.9.0] - 2023-07-07
### Added
- `removeCommonProperties` method

## [1.8.1] - 2023-06-24
### Fixed
- `replace` method replacing everything with bunch of `undefined` when empty map is given

## [1.8.0] - 2023-06-03
### Added
- `formatDate` method
### Dev
- deps update

## [1.7.0] - 2023-05-22
### Added
- `later` method

## [1.6.0] - 2023-05-12
### Added
- `compareProps` method

## [1.5.0] - 2023-05-12
### Added
- `compareArrays` method
- `unique` method

## [1.4.0] - 2023-05-11
### Added
- `escapeRegExp` method
- `replace` method
- `sortProps` method

## [1.3.0] - 2023-05-07
### Added
- `safe` method
### Dev
- upgraded some jsdocs
- upgraded deps

## [1.2.0] - 2023-03-01
### Added
- `ensureDate` method
- `ensurePrefix` method
- `ensureSuffix` method
- `ensureTimestamp` method
- `stripPrefix` method
- `stripSuffix` method

## [1.1.0] - 2023-02-20
### Added
- `isNumericString` method
- `occurrences` method
### Changed
- `isEmpty` throws `TypeError` instead of `Error` on primitives

## [1.0.0] - 2023-02-19
### Added
- `isPlainObject` method
### Breaking
- changed `isEmpty` to throw on primitives
- `makeArray` is renamed to `ensureArray`
- `wait.sync` is extracted as `waitSync`
- removed `pack` method
- removed `pages` method
- replaced `merge.UNSET` with `mergeUNSET`
- replaced `mapValues.REMOVE` with `mapValuesUNSET`
### Changed
- added some examples to docs
- in jsdoc added a warning to get/set and family about using them with TS
### Dev
- added missing docs
- fixed some jsdoc strings (so they contain types for non-ts users)
- fixed typedoc warnings
- README update, preparing to rename library

## [0.24.1] - 2022-11-08
### Dev
- exported some typings
- library template bump

## [0.24.0] - 2022-09-23
### Added
- `pull` method
### Changed
- `throttle` with multiple timeouts working more as intended with `opts.leading` = true
### Fixed
- first timeout of `throttle` with multiple timeouts repeated two times

## [0.23.2] - 2022-08-21
### Fixed
- `throttle` with trailing call not respecting multiple timeouts
- `truthy` typings

## [0.23.1] - 2022-07-17
### Fixed
- missing `mostFrequent` export

## [0.23.0] - 2022-07-17
### Added
- `mostFrequent` method

## [0.22.0] - 2022-07-16
### Added
- `capitalize` method
### Fixed
- `throttle` reset not resetting array of times

## [0.21.0] - 2022-07-08
### Added
- `throttle` method

## [0.20.0] - 2022-07-03
### Added
- `ensureError` method

## [0.19.1] - 2022-04-27
### Fixed
- new methods not exported

## [0.19.0] - 2022-04-27
### Added
- `scale`, `truthy`, `waitFor`, `cap` methods
### Changed
- improved types for `insertSeparator`
- added/improved jsdoc to `mapAsync`, `match`, `merge`, `noop`, `rethrow`
### Breaking
- `seq` no longer uses nor exports custom error

## [0.18.0] - 2021-12-04
### Added
- `wait` method
- `mapAsync` method

## [0.17.1] - 2021-10-31
### Fixed
- missing `merge` export

## [0.17.0] - 2021-10-31
### Added
- `merge` method
### Changed
- `REMOVE` special property in `mapValues` now uses Symbols if available

## [0.16.0] - 2021-09-24
### Added
- `noop` and `rethrow` methods

## [0.15.0] - 2021-07-04
### Added
- `seq` with early break mode
### Changed
- upgraded typings for `last`

## [0.14.1] - 2021-06-13
### Changed
- upgraded typings for `pick`, `omit`, `pack`, `sortBy`

## [0.14.0] - 2021-06-05
### Changed
- upgraded typings for sortBy
### Added
- `seq` method

## [0.13.2] - 2021-05-16
### Changed
- upgraded typings for pick, omit, get, getMultiple, mapValues, set, setImmutable, sortBy

## [0.13.1] - 2021-04-14
### Changed
- upgraded typings for mapValues
### Dev
- fixed invalid name in `types` package.json field
- bumped some deps
- added missing testcase for mapValues

## [0.13.0] - 2021-02-03
### Added
- `match` method
- `pack` method
- `sortBy` method

## [0.12.0] - 2021-01-19
### Added
- `makeArray` method

## [0.11.0-beta.2] - 2021-01-08
### Dev
- add basic TypeScript support
- replaced mocha with jest
- replaced jsdoc with typedoc
### Changed
- small README update

## [0.10.1] - 2020-09-14
### Fixed
- `pages` export

## [0.10.0] - 2020-09-14
### Added
- `pages` method

## [0.9.0] - 2020-07-09
### Added
- `remove` method

## [0.8.0] - 2020-03-13
### Fixed
- CommonJS code still not working properly
### Changed
- `REMOVE` enum from mapValues attached to the function instead of extra export
- better native ESM support

## [0.7.1] - 2020-03-12
### Fixed
- CommonJS code not working properly

## [0.7.0] - 2020-03-10
### Added
- native ESM support
### Changed
- upgraded deps
### Removed
- support for deep imports like: `bottom-line-utils/get`, use `bottom-line-utils/src/get` or
`bottom-line-utils/dist/get` for now

## [0.6.3] - 2019-08-29
### Fixed
- dev deps audit issues

## [0.6.2] - 2019-06-06
### Fixed
- deps audit issue, related to development (eslint), not the code (0.6.2 is not released to npm as a result)

## [0.6.1] - 2019-06-05
### Fixed
- deps audit issue, related to docs generating, not the code (0.6.1 is not released to npm as a result)

## [0.6.0] - 2019-05-12
### Added
- `pick` and `omit` methods
### Changed
- babel config for `dist` transpiled code upgraded, to transpile less features

## [0.5.0] - 2019-04-09
### Added
- `coalesce` method

## [0.4.1] - 2019-01-31
### Fixed
- `setImmutable` not allowing number as path and allowing other incorrect/unexpected values as paths

## [0.4.0] - 2019-01-30
### Added
- `insertSeparator` method

## [0.3.1] - 2018-12-09
### Fixed
- added missing export of `setImmutable` to index

## [0.3.0] - 2018-12-09
### Fixed
- missing labels in `set` tests
- disabled removing unused labels in tests
### Changed
- improved one `set` test
### Added
- `setImmutable` method

## [0.2.0] 2018-12-09
### Added
- `set` function
- @todo for get/set methods, that should test and support correctly Sets, Maps, etc.
- dev stuff: linter, editorconfig

### Changed
- upgraded library template
- switched code to es modules
- linted code

## [0.1.2] - 2018-11-09
### Fixed
- fixed `mapValues` calling the method twice

## [0.1.1] - 2018-05-31
### Changed
- README update

## [0.1.0] - 2018-05-31
### Added
- `get` function
- `getMultiple` function
- `isEmpty` function
- `last` function
- `mapValues` function
