# Changelog

All notable changes to BoxDSL will be documented in this file.

## [1.0.0] - 2026-04-14

### Added
- **Plug-and-Play Architecture**: BoxDSL is now a self-contained folder you drop into any project. No workspace nesting required.
- **Architecture Validation Engine**: Zod-based schema validation for `architecture.yaml` with clear error reporting.
- **Dependency Graph Analysis**: DFS-based cycle detection and missing dependency validation.
- **Topological Sequencing**: Kahn's algorithm calculates the optimal "Bottom-Up" implementation order (Repositories → Services → Adapters).
- **Blueprint Generation**: Auto-generates per-module Markdown blueprints with strict dependency contracts, constraints, and interface specifications.
- **Infrastructure Blueprint**: Mandates Docker containerization at the project root with environment parity.
- **Implementation Sequence**: Groups boxes into topological milestones for phased development.
- **AI Onboarding Prompt**: Master mission document for AI agents with strict rules of engagement.
- **Interactive Persona Calibration**: CLI prompt to define a custom AI persona during generation.
- **Human-in-the-Loop Protocol**: AI agents must provide manual test guides and wait for user sign-off after every implementation.
- **Plan-First Mandate**: AI agents must submit a file-by-file plan before writing any code.
- **Business Requirements Integration**: Engine mandates reading `./requirements/` before implementation.
- **Example Architecture**: Included `architecture.example.yaml` as a reference template.
