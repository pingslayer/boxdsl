# BoxDSL — Plug-and-Play Architecture Orchestrator
> **Hallucination-Proof AI Orchestration via Strict Dependency Graphs.**

BoxDSL is a portable, self-contained architecture engine that you drop into any software project. It validates your system design, calculates the optimal build order, and generates AI-ready blueprints that command implementing agents to build your application with zero architectural drift.

---

## 🎯 Why BoxDSL?

Traditional AI code generation often suffers from **"Architectural Drift"**—where the LLM ignores project boundaries, creates circular dependencies, or "hallucinates" global state. BoxDSL solves this by becoming the single source of truth for your system's design.

- **Strict Isolation**: Modules (Boxes) are strictly forbidden from communicating with anything not explicitly defined in their dependency graph.
- **Cycle Detection**: The engine uses a Depth-First Search (DFS) algorithm to detect and block circular dependencies before a single line of code is written.
- **Contextual Blueprints**: Generates professional, human-readable (and AI-consumable) Markdown blueprints for every module.
- **Topological Sequencing**: Automatically calculates the optimal "Bottom-Up" implementation order, ensuring dependencies are built before the modules that use them.
- **Human-in-the-Loop**: AI agents are forbidden from self-validating. After every implementation, they must provide a manual test guide and wait for your sign-off.

---

## 🧱 The Core Concepts

BoxDSL organizes your software into **Boxes**, each with a specific role:

1.  **Repositories**: The persistence layer. These boxes have exclusive permission to touch the database or local storage.
2.  **Services**: The home of business logic. They are stateless, platform-agnostic, and orchestrate logic between Repositories and Adapters.
3.  **Adapters**: The system's entry and exit points (HTTP APIs, CLI, External Integrations).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher.
- **TypeScript**: Handled via `ts-node` (installed automatically).

### 2. Install BoxDSL
Install the orchestration engine as a development dependency in your project:

```bash
npm install @pingslayer/boxdsl --save-dev
```

### 3. Initialize the Orchestrator
To scaffold the architecture environment, run the `init` command from your project root:

```bash
npx boxdsl init
```

This creates an isolated `boxdsl/` directory in your project containing:
- `architecture.yaml`: Your initial system design template.
- `requirements/`: A folder for your business specs and user stories.

### 4. Define Your Architecture
Edit `boxdsl/architecture.yaml` to define your custom system topology:

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

### 5. Define Your Business Requirements
Add markdown files to `boxdsl/requirements/` describing the business goals, user stories, and acceptance criteria for your project. The AI agent will read these before writing any code.

### 6. Run the Engine
From your project root, trigger the orchestration engine to validate the architecture and generate the blueprints:

```bash
npx boxdsl start
```

The engine will generate all blueprints into `boxdsl/docs/`.

### 7. Feed to AI
Copy the generated `boxdsl/docs/AI-Onboarding-Prompt.md` mission block and paste it into a fresh AI agent session. The agent will use the blueprints to implement your project directly in the root directory.

---

## 📁 Folder Structure

```
boxdsl/
├── src/                          # Engine source code (TypeScript)
├── docs/                         # Generated blueprints (output)
│   ├── AI-Onboarding-Prompt.md   # Master mission for AI agents
│   ├── Infrastructure.md         # Environment & Docker mandate
│   ├── Implementation-Sequence.md # Topological build order
│   └── [BoxName].md              # Per-module contracts
├── requirements/                 # Business logic & specifications
├── architecture.yaml             # Your system design
├── architecture.example.yaml     # Reference template
├── package.json                  # Engine dependencies & scripts
└── tsconfig.json                 # TypeScript configuration
```

---

## 📄 Output: Orchestration Blueprints

Once the engine runs successfully, it populates `boxdsl/docs/` with:

- **`AI-Onboarding-Prompt.md`**: The master mission statement. Copy this into an AI session to begin implementation.
- **`Infrastructure.md`**: Environment requirements and Docker containerization mandate.
- **`Implementation-Sequence.md`**: The auto-calculated "Bottom-Up" roadmap, grouping boxes into topological milestones (Persistence → Logic → Interface).
- **`[BoxName].md`**: Individual module blueprints with strict dependency contracts, constraints, and interface specifications.

---

## 🤖 AI Implementation Workflow

BoxDSL operates as a **Satellite Architect** for the parent project. The AI agent works in the **parent directory (`../`)** while reading blueprints from `./boxdsl/`.

### Phase 1: Environment Orchestration
**Input**: `./boxdsl/docs/Infrastructure.md`
**Goal**: The AI creates the `Dockerfile` and `docker-compose.yml` in the **parent directory (`../`)**.

### Phase 2: Strategic Goal Alignment
**Input**: `./boxdsl/requirements/*.md`
**Goal**: The AI reads business requirements to understand the project goals before writing any code.

### Phase 3: Box-by-Box Implementation
**Input**: `./boxdsl/docs/[BoxName].md`
**Goal**: Implementation of each module in the **parent directory (`../`)**, following the order defined in `Implementation-Sequence.md`. Strictly enforce `depends_on` and `constraints`.

---

## 🛡️ Preventing Hallucinations

- **Plan First**: Before writing any code, the AI must provide a detailed file-by-file plan and wait for user approval.
- **Manual Handover**: After every implementation, the AI MUST provide a step-by-step manual test guide and wait for user sign-off before proceeding.
- **Isolation Rule**: If an AI tries to call a module NOT listed in a blueprint's `depends_on` section, reject the code immediately.
- **Topological Order**: Build from the "Bottom-Up" (Repositories → Services → Adapters). Refer to `./boxdsl/docs/Implementation-Sequence.md`.

---

## ⚖️ License
MIT License. See [LICENSE](LICENSE) for details.
