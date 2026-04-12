# 📦 BoxDSL

## Overview

**BoxDSL** is a domain-specific language (DSL) for defining software architecture in a structured, enforceable way.

Instead of writing code directly, developers define:
- Modules (called **boxes**)
- Responsibilities
- Dependencies
- Constraints

BoxDSL then validates the design and orchestrates AI-driven code generation.

> Code is an artifact. BoxDSL is the source of truth.

---

## 🎯 Goals

- Enforce consistent architecture across systems
- Eliminate ambiguity in AI-generated code
- Make software design explicit and machine-readable
- Enable deterministic, repeatable code generation
- Separate **design** from **implementation**

---

## 🧠 Core Concepts

### 1. Box

A **box** represents a module in the system.

Each box defines:
- Name
- Type (architectural role)
- Responsibility
- Dependencies
- Constraints
- Inputs / Outputs (optional)

---

### 2. System

A **system** is a collection of boxes and global conventions.

---

### 3. Constraints

Constraints define **what a box is allowed or forbidden to do**.

Examples:
- `stateless`
- `no_direct_db_access`
- `database_access`

---

### 4. Dependency Graph

Boxes form a **directed graph** using `depends_on`.

This graph is used for:
- Validation
- Cycle detection
- Execution planning
- AI orchestration

---

## 🧱 Box Types (v0.1)

BoxDSL v0.1 defines **three architectural roles**:

### `service`
- Contains business logic
- Stateless by default
- Orchestrates workflows
- Cannot access database directly

---

### `repository`
- Handles persistence
- Owns data access
- Interfaces with database

---

### `adapter`
- Entry/exit point of the system
- Interfaces with external systems
- Examples: HTTP, CLI, queues

---

## 📄 BoxDSL Syntax (YAML)

Example:

```yaml
system: MyApp

global:
  conventions:
    - clean_architecture
    - layered_modules

boxes:
  - name: UserAuth
    type: service
    responsibility: Handle authentication

    constraints:
      - stateless
      - no_direct_db_access

    inputs:
      - LoginRequest
    outputs:
      - AuthToken

    depends_on:
      - UserRepository

  - name: UserRepository
    type: repository
    constraints:
      - database_access

