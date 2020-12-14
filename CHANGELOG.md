# Colonial Wars Main Changelog
Changelog for ``colonialwars-main``.

The format is based on [Keep a Changelog][1], and this project adheres to [Semantic Versioning][2].

## [v0.1.1] - 2020-12
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
[v0.1.1]: https://github.com/Take-Some-Bytes/colonialwars-main/tree/main
