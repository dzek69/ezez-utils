All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

THIS LIBRARY IS DEPRECATED. PLEASE SWITCH TO THE SUCCESSOR: `@ezez/utils`.

## [0.24.3] - 2026-08-16
### Fixed
- possible prototype pollution on untrusted input on `set`, `setImmutable`, `merge`

## [0.24.2] - 2023-03-10
### Dev
- added missing docs
- fixed some jsdoc strings (so they contain types for non-ts users)
- README update, preparing to rename library
### Breaking
- changed `isEmpty` to throw on primitives
- `makeArray` is renamed to `ensureArray`
- `wait.sync` is extracted as `waitSync`
### Changed
- in jsdoc added a warning to get/set and family about using them with TS
### Added
- `isPlainObject` method

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
