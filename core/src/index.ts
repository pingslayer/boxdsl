import * as fs from "fs";
import * as path from "path";
import { parseArchitecture } from "./parse";
import { SystemGraph } from "./graph";
import { validateDependencies } from "./validateGraph";

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
    
    console.log(`🎉 READY FOR AI GENERATION PIPELINE!`);

  } catch (error: any) {
    // We catch our custom errors and print them beautifully to the user
    console.error(`\n================================`);
    console.error(`🛠️  ARCHITECTURE ERROR DETECTED `);
    console.error(`================================\n`);
    console.error(error.message || error);
    console.error(`\n================================\n`);
    process.exit(1);
  }
}

main();
