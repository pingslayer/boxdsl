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
> This project MUST include a \`Dockerfile\` and a \`docker-compose.yml\` in the root directory. All services defined in the architecture must be orchestratable via Docker Compose to ensure a "one-command" setup and environment parity.

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
**Total Milestones**: ${layers.length}

## Overview
This document provides the mandatory "Bottom-Up" implementation order for the project. To ensure architectural integrity and minimize code rework, follow these milestones in sequence. Do not implement a box until its dependencies in previous milestones are completed.

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
