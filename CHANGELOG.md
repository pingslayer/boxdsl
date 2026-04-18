# Changelog

All notable changes to BoxDSL will be documented in this file.

## [1.1.0] - 2026-04-18

### Added
- **NPM CLI Distribution**: BoxDSL is now an installable global/local CLI. Users can run it via `npx boxdsl`.
- **Project Scaffolding**: Added `npx boxdsl init` to automatically scaffold the architecture folder, YAML template, and requirements directory.
- **Improved Orchestration**: Added `npx boxdsl start` to trigger blueprint generation from the project root.

### Changed
- **Package Renaming**: Officially renamed the package to **`boxdsl`** for cleaner installation.
- **Dynamic Pathing**: The engine now handles implementation targets relative to the project root (`./`) rather than assuming a parent directory structure.
- **Updated README**: Documentation now reflects the NPM-first workflow.

## [1.0.0] - 2026-04-14
... (previous entries)
