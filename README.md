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
- **`[BoxName].md`**: Individual blueprints for every box, listing specific responsibilities, inputs, outputs, and strict dependency rules.

**These documents are designed to be fed into an AI agent (like a coding assistant) as the primary instruction set for implementation.**

---

## 🤖 AI Implementation Workflow

To maintain absolute control and prevent architectural drift, follow this phase-based orchestration strategy when feeding BoxDSL blueprints to an AI builder:

### Phase 1: Environment Orchestration
**Input**: `workspace/docs/Infrastructure.md`  
**Goal**: Set up the containerized environment (Dockerfile, Docker Compose) as the mandatory stage for all subsequent code.

### Phase 2: Strategic Goal Alignment
**Input**: `workspace/requirements/*.md`  
**Goal**: Injection of the "Business Voice." Ensure the AI understands the client's problem statement and success metrics before writing logic.

### Phase 3: The "Box-by-Box" Factory
**Input**: A single `workspace/docs/[Box].md`  
**Goal**: Implementation of a specific module in isolation. Strictly enforce the `depends_on` and `constraints` listed in the blueprint. **Never build multiple boxes in one prompt.**

### Phase 4: Integration & Assembly
**Input**: Adapter blueprints (e.g., `HttpApiAdapter.md`)  
**Goal**: Wiring the services together and connecting the frontend.

---

## 🛡️ Preventing Hallucinations

- **Isolation Rule**: If an AI tries to call a module NOT listed in a blueprint's `depends_on` section, reject the code immediately.
- **Topological Order**: Always implement boxes from the "Bottom-Up" (Repositories -> Services -> Adapters). Refer to `workspace/docs/Implementation-Sequence.md` for the auto-calculated roadmap.
- **Strict Stop**: If an AI suggests a feature not in your architecture, stop the implementation. Update the `architecture.yaml`, regenerate the blueprints, and then resume.

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
