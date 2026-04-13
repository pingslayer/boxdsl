# BoxDSL Architecture Engine
> **Hallucination-Proof AI Orchestration via Strict Dependency Graphs.**

BoxDSL is a specialized Domain Specific Language (DSL) and validation engine designed to "structure AI thinking" during the software development lifecycle. By enforcing rigid architectural boundaries and generating verbose orchestration blueprints, BoxDSL ensures that AI-generated code remains modular, isolated, and true to the original design intent.

---

## 🎯 Why BoxDSL?

Traditional AI code generation often suffers from **"Architectural Drift"**—where the LLM ignores project boundaries, creates circular dependencies, or "hallucinates" global state. BoxDSL solves this by becoming the single source of truth for your system's design.

- **Strict Isolation**: Modules (Boxes) are strictly forbidden from communicating with anything not explicitly defined in their dependency graph.
- **Cycle Detection**: The engine uses a Depth-First Search (DFS) algorithm to detect and block circular dependencies before a single line of code is written.
- **Contextual Blueprints**: Generates professional, human-readable (and AI-consumable) Markdown blueprints for every module.
- **Topological Sequencing**: Automatically calculates the optimal "Bottom-Up" implementation order, ensuring dependencies are built before the modules that use them.
- **Docker-Default Infrastructure**: Automatically mandates containerization and environment parity across the entire project.

---

## 🧱 The Core Concepts

BoxDSL organizes your software into **Boxes**, each with a specific role:

1.  **Services**: The home of business logic. They are stateless, platform-agnostic, and orchestrate logic between Repositories and Adapters.
2.  **Repositories**: The persistence layer. These boxes have exclusive permission to touch the database or local storage.
3.  **Adapters**: The system's entry and exit points (HTTP APIs, CLI, External Integrations).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher.
- **TypeScript**: Handled via `ts-node`.

### 2. Define Your Architecture
Copy the `workspace/architecture.example.yaml` to `workspace/architecture.yaml` and define your system:

```yaml
system: "MySystem"
global:
  constraints:
    - "Use Clean Architecture"
  infrastructure:
    - "Node.js 20"
    - "PostgreSQL 15"

boxes:
  - name: "UserService"
    type: "service"
    responsibility: "Handles user lifecycle."
    depends_on: ["UserRepository"]
    inputs: ["UserRecord"]
    outputs: ["UserID"]
```

### 3. Run the Engine
Execute the engine from the `core/` directory to validate your design and generate blueprints.

```bash
cd core
npm start
```

---

## 📄 Output: Orchestration Blueprints

Once the engine runs successfully, it populates `workspace/docs/` with specialized orchestration documents:

- **`Infrastructure.md`**: Commands the AI to set up the Docker/Compose environment.
- **`Implementation-Sequence.md`**: The auto-calculated "Bottom-Up" roadmap. It groups boxes into topological milestones (Persistence -> Logic -> Interface) to ensure zero context-mismatch during build.
- **`[BoxName].md`**: Individual

## 🛠️ "Plug-and-Play" Project Structure

This folder contains the complete **BoxDSL Orchestration Suite**. You can copy this entire directory into any project root to manage its architecture.

- **`/src`**: The BoxDSL Engine tool (Source).
- **`/requirements`**: Your business logic and client specifications.
- **`/docs`**: System-generated orchestration blueprints.
- **`architecture.yaml`**: Your system design file.
- **`package.json`**: Engine dependencies and control scripts.

---

## 🤖 AI Implementation Workflow

BoxDSL operates as a **Satellite Architect** for the parent project. To maintain absolute control, follow this phase-based orchestration strategy:

### Phase 1: Environment Orchestration
**Input**: `./docs/Infrastructure.md`  
**Goal**: The AI creates the containerized environment (`Dockerfile`, `docker-compose.yml`) in the **parent directory (`../`)**.

### Phase 2: Strategic Goal Alignment
**Input**: `./requirements/*.md`  
**Goal**: Injection of the "Business Voice." AI reads the parent context and local requirements before writing code.

### Phase 3: The "Box-by-Box" Factory
**Input**: A single `./docs/[Box].md`  
**Goal**: Implementation of a specific module in the **parent directory (`../`)**. Strictly enforce `depends_on` and `constraints`.

---

## 🛡️ Preventing Hallucinations

- **Manual Handover**: After every implementation, the AI MUST provide a manual test guide and wait for user sign-off.
- **Isolation Rule**: If an AI tries to call a module NOT listed in a blueprint's `depends_on` section, reject the code immediately.
- **Topological Order**: Build from the "Bottom-Up" (Repositories -> Services -> Adapters). Refer to `./docs/Implementation-Sequence.md`.

---

## 🛠️ Project Structure

- **/core**: The BoxDSL Engine logic (Schema validation, Graph analysis, Blueprint generation).
- **/workspace**: Your project laboratory.
    - `architecture.yaml`: Your system design.
    - `/docs`: System-generated blueprints (The "AI Thinking" structure).
    - `/src`: Where the AI implements the code based on the blueprints.

---

## ⚖️ License
Internal Use / Prototype. Created for Advanced Agentic Coding workflows.
