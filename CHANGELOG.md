# Colonial Wars Main Changelog
Changelog for ``colonialwars-main``.

The format is based on [Keep a Changelog][1], and this project adheres to [Semantic Versioning][2].

## [v0.1.2] - 2020-12-17
### Added:
- Added ``winston`` and ``winston-syslog`` to do application logging.
### Changed:
- Changed expectations when testing classes–now we also check if a value is an *instance*
of a class, instead of just checking if the error was ``null``.
- Made some micro-optimizations... Meaning, I replaced a few loops here, tried not to access
the same property of an object repetitively in a loop, etc.
- Made class properties more obvious, by setting uninitialized class properties to ``null``,
instead of just letting people find where they're defined.
- Moved all graceful shutdown handlers to other files.
- Stopped passing ``DEBUG`` environment variable if ``IS_PROD`` is set to ``true``.

## [v0.1.1] - 2020-12-13
### Changed:
- Made ``ColonialwarsManager`` clear all objects that store information about was-running
subprocesses after calls to ``.stopAll()``.
- Made this package pass down the ``DEBUG`` environment variable to subprocesses.
- Used ``error.stack`` instead of the ``error`` object.
- Used the graceful shutdown handlers of the ``AppServer`` class (from ``colonialwars-appserver``)
in ``app-bin.js``.
### Fixed:
- Fixed broken CHANGELOG links.

## [v0.1.0] - 2020-12-12
- Initial (pre-)release

[1]: https://keepachangelog.com/
[2]: https://semver.org

[v0.1.0]: https://github.com/Take-Some-Bytes/colonialwars-main/tree/2ca231664a1ef41334d8bd500f0fddf08654310e
[v0.1.1]: https://github.com/Take-Some-Bytes/colonialwars-main/tree/025bd6b1accd68e752a5a5fbc74a475451c94f0d
[v0.1.1]: https://github.com/Take-Some-Bytes/colonialwars-main/tree/main
