import * as fs from "fs";
import * as path from "path";
import { SystemGraph } from "./graph";
import { Box } from "./schema";

export function generateDocs(graph: SystemGraph, outputDir: string): string[] {
  // 1. Ensure output directory exists and is clean
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  } else {
    // Perform a full wipe of the docs directory for safety
    const files = fs.readdirSync(outputDir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        fs.unlinkSync(path.join(outputDir, file));
      }
    }
  }

  const generatedFiles: string[] = [];

  // 2. Generate a document for each box
  for (const boxName of graph.getBoxNames()) {
    const mergedBox = graph.getMergedBox(boxName);
    if (!mergedBox) continue;

    const markdown = createMarkdownTemplate(mergedBox, graph.systemName);
    const fileName = `${mergedBox.name}.md`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, markdown, "utf-8");
    generatedFiles.push(fileName);
  }

  return generatedFiles;
}

/**
 * Generates a system-level infrastructure blueprint mapping the Docker/Environment requirements.
 */
export function generateInfrastructureDoc(graph: SystemGraph, outputDir: string): string {
  const infrastructure = graph.infrastructure.length > 0
    ? graph.infrastructure.map(i => `- ${i}`).join("\n")
    : "- No specific infrastructure requirements defined.";

  const markdown = `# System Infrastructure Blueprint
**System**: ${graph.systemName}

## Overview
This document outlines the environmental and infrastructure requirements for the ${graph.systemName} project. Any AI orchestration or developer implementation must adhere to these specifications to ensure environment consistency.

## Environment Requirements
${infrastructure}

## Mandatory Containerization
> [!IMPORTANT]
> **Docker Implementation Required (System Default)**
> The project MUST include a \`Dockerfile\` and a \`docker-compose.yml\` located **specifically within the \`workspace/src/\` directory**. ALL source code and orchestration must be contained in this folder to ensure absolute isolation from the BoxDSL core.

---
*System-generated documentation provided by the BoxDSL Engine.*
`;

  const filePath = path.join(outputDir, "Infrastructure.md");
  fs.writeFileSync(filePath, markdown, "utf-8");
  return "Infrastructure.md";
}

/**
 * Generates the master Implementation-Sequence blueprint using a topological sort.
 */
export function generateSequenceDoc(graph: SystemGraph, layers: string[][], outputDir: string): string {
  const milestoneSections = layers.map((layer, index) => {
    const boxes = layer.map(name => {
      const box = graph.getBox(name);
      return `- **${name}** (${box?.type.toUpperCase()}): ${box?.responsibility}`;
    }).join("\n");

    return `### Milestone ${index + 1}: ${getMilestoneTitle(index, layer, graph)}
${boxes}`;
  }).join("\n\n");

  const markdown = `# Implementation Sequence: ${graph.systemName}
**Total Milestones**: ${layers.length + 1}

## Overview
This document provides the mandatory "Bottom-Up" implementation order for the project. To ensure architectural integrity and minimize code rework, follow these milestones in sequence. Do not implement a box until its dependencies in previous milestones are completed.

## Milestone 0: Project Scaffolding
Before implementing any boxes, you MUST establish the project framework:
- Initialize the target project in \`workspace/src/\` (e.g., \`composer create-project\` or similar).
- Configure the environment files (.env) according to the infrastructure blueprint.
- Ensure the base framework structure is in place before proceeding to Milestone 1.

## Strategy
We start with self-contained boxes (usually Repositories) and move upwards through business logic (Services) to high-level interfaces (Adapters).

${milestoneSections}

---
*System-generated documentation provided by the BoxDSL Engine.*
`;

  const filePath = path.join(outputDir, "Implementation-Sequence.md");
  fs.writeFileSync(filePath, markdown, "utf-8");
  return "Implementation-Sequence.md";
}

/**
 * Generates a master onboarding prompt for other AI agents to consume.
 */
export function generateOnboardingPrompt(graph: SystemGraph, outputDir: string, persona: string): string {
  const infraStr = graph.infrastructure.join(", ");
  
  const markdown = `# AI Onboarding Prompt: ${graph.systemName}

> [!NOTE]
> **Instructions for the Architect**
> Copy the entire block below and paste it into a fresh session with an AI agent (like Antigravity, ChatGPT, or Claude) to begin the implementation phase.

---

\`\`\`markdown
# MISSION: Software Implementation for ${graph.systemName}

You are an ${persona}. Your mission is to implement the **${graph.systemName}** system based on strict **BoxDSL** blueprints.

## 🛠️ The Tech Stack
- **Architecture**: BoxDSL (Strict Dependency Graph)
- **Environment**: ${infraStr}
- **Containerization**: Mandatory (Dockerfile & docker-compose.yml required)

## 📂 The Blueprint Library
You have access to the following project data. These are your absolute source of truth:
1. **Business Logic**: All files in \`workspace/requirements/\` (Read these first to understand goals).
2. **Infrastructure**: \`workspace/docs/Infrastructure.md\`
3. **Strategy/Order**: \`workspace/docs/Implementation-Sequence.md\`
4. **Module Blueprints**: \`workspace/docs/[BoxName].md\` (Strict data contracts).

## 🛡️ The Rules of Engagement
1. **No Hallucinations**: You are strictly forbidden from implementing features, routes, or modules not defined in the BoxDSL graph.
2. **Directory Isolation**: ALL source code, project files, and implementation tasks MUST take place within the \`workspace/src/\` directory. Do not modify files in \`core/\` or \`workspace/docs/\`.
3. **Strict Isolation**: A module (Box) may **only** interact with the dependencies listed in its \`depends_on\` section. No exceptions.
4. **Bottom-Up Implementation**: We build from the foundation upwards. Refer to the \`Implementation-Sequence.md\` for the correct order.
5. **Validation Check**: Before returning any code, verify that it adheres to all constraints listed in the box blueprint.

## 🚀 STARTING THE WORK
Do not implement everything at once. You MUST follow this **Checklist Protocol**:
1. **Milestone Plan**: Before writing any code for a milestone, provide a detailed file-by-file plan of what you intend to do.
2. **User Approval**: Wait for the user to say "Proceed with plan" before executing.
3. **Execution**: Implement the milestone exactly as planned.

### The Phased Workflow:
- **Phase 1**: Setup the environment (Infrastructure). Create the \`Dockerfile\` and \`docker-compose.yml\` **only** inside the \`workspace/src/\` directory.
- **Phase 2**: **Milestone 0 - Project Scaffolding.** Establish the Laravel/Vue framework boilerplate in \`workspace/src/\`.
- **Phase 3**: Milestone 1 - Implement the "Foundation" boxes (Repositories) within the \`workspace/src/\` directory.

**Acknowledge this mission and I will provide the first blueprint from the Implementation Sequence.**
\`\`\`
`;

  const filePath = path.join(outputDir, "AI-Onboarding-Prompt.md");
  fs.writeFileSync(filePath, markdown, "utf-8");
  return "AI-Onboarding-Prompt.md";
}

function getMilestoneTitle(index: number, boxNames: string[], graph: SystemGraph): string {
  const types = boxNames.map(name => graph.getBox(name)?.type);
  if (types.every(t => t === 'repository')) return "Persistence Foundation";
  if (types.every(t => t === 'service')) return "Business Logic Layer";
  if (types.every(t => t === 'adapter')) return "Interface & Delivery";
  return `System Integration Layer ${index + 1}`;
}

function createMarkdownTemplate(box: Box, systemName: string): string {
  const constraints = box.constraints.length > 0 
    ? box.constraints.map(c => `- ${c}`).join("\n") 
    : "- No operational constraints defined.";

  const dependencies = box.depends_on.length > 0
    ? box.depends_on.map(d => `- **${d}**: Integration required for functional implementation.`).join("\n")
    : "- No external dependencies defined for this module.";

  const inputs = box.inputs.length > 0 ? box.inputs.join(", ") : "None";
  const outputs = box.outputs.length > 0 ? box.outputs.join(", ") : "None";

  return `# Module: ${box.name}
**Type**: ${box.type.toUpperCase()}  
**System**: ${systemName}

## Responsibility
${box.responsibility || "No specific responsibility defined."}

## Dependencies (Context Identification)
${dependencies}

> [!IMPORTANT]
> **Architectural Isolation Rule**
> Implementation is strictly restricted to the dependencies listed above. Direct communication with unlisted modules is prohibited to maintain the integrity of the system architecture.

## Operational Constraints
${constraints}

## Interface Specification
- **Inputs**: ${inputs}
- **Outputs**: ${outputs}

---
*System-generated documentation provided by the BoxDSL Engine. Manual modifications may be overwritten.*
`;
}
