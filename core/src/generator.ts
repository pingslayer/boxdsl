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
