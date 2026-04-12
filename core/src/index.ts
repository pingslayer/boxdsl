import * as fs from "fs";
import * as path from "path";
import { ZodError } from "zod";
import { parseArchitecture } from "./parse";
import { SystemGraph } from "./graph";
import { validateDependencies } from "./validateGraph";
import { generateDocs, generateInfrastructureDoc } from "./generator";

function formatZodError(error: ZodError): string {
  const issues = error.issues.map((issue) => {
    const pathLabel = issue.path.length > 0 ? `[${issue.path.join(".")}]` : "root";
    return `   - Location: ${pathLabel}\n     Detail: ${issue.message}`;
  });
  return `Schema Validation failed:\n${issues.join("\n")}`;
}

function main() {
  // Grab the file path from the command line, or default to the workspace test file
  const relativePath = process.argv[2] || "../workspace/architecture.yaml";
  const absolutePath = path.resolve(__dirname, "..", relativePath);

  console.log(`📦 BoxDSL Engine Starting...`);
  console.log(`Analyzing: ${absolutePath}\n`);

  try {
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`YAML file not found at ${absolutePath}`);
    }

    // 1. Read Raw Text
    const rawYaml = fs.readFileSync(absolutePath, "utf-8");

    // 2. Parse & Validate Schema
    const architectureData = parseArchitecture(rawYaml);
    console.log(`✅ Schema: Validated successfully`);

    // 3. Build Graph Map
    const systemGraph = new SystemGraph(architectureData);
    console.log(`✅ Graph map built: Found ${systemGraph.getAllBoxes().length} boxes`);

    // 4. Validate Dependencies & Cycles
    validateDependencies(systemGraph);
    console.log(`✅ Architecture validation passed! No missing or circular dependencies.\n`);

    // 5. Generate Orchestration Documents
    const docsDir = path.resolve(__dirname, "../../workspace/docs");
    console.log(`🔨 Generating orchestration blueprints in: ${docsDir}...`);
    const generated = generateDocs(systemGraph, docsDir);
    console.log(`✅ Success: Generated ${generated.length} blueprints`);

    // 6. Generate Infrastructure Doc
    console.log(`🔨 Generating infrastructure blueprint...`);
    const infraFile = generateInfrastructureDoc(systemGraph, docsDir);
    console.log(`✅ Success: Generated ${infraFile}\n`);

    console.log(`🎉 READY FOR AI GENERATION PIPELINE!`);

  } catch (error: any) {
    // We catch our custom errors and print them beautifully to the user
    console.error(`\n================================`);
    console.error(`🛠️  ARCHITECTURE ERROR DETECTED `);
    console.error(`================================\n`);
    
    if (error instanceof ZodError) {
      console.error(formatZodError(error));
    } else {
      console.error(`❌ ${error.message || error}`);
    }
    
    console.error(`\n================================\n`);
    process.exit(1);
  }
}

main();
