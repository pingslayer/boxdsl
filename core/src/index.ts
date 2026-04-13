import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { ZodError } from "zod";
import { parseArchitecture } from "./parse";
import { SystemGraph } from "./graph";
import { validateDependencies } from "./validateGraph";
import { generateDocs, generateInfrastructureDoc, generateSequenceDoc, generateOnboardingPrompt } from "./generator";

function formatZodError(error: ZodError): string {
  const issues = error.issues.map((issue) => {
    const pathLabel = issue.path.length > 0 ? `[${issue.path.join(".")}]` : "root";
    return `   - Location: ${pathLabel}\n     Detail: ${issue.message}`;
  });
  return `Schema Validation failed:\n${issues.join("\n")}`;
}

async function main() {
  // Grab the file path from the command line, or default to the root-level architecture file
  const relativePath = process.argv[2] || "../architecture.yaml";
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
    const docsDir = path.resolve(__dirname, "../../docs");
    console.log(`🔨 Generating orchestration blueprints in: ${docsDir}...`);
    const generated = generateDocs(systemGraph, docsDir);
    console.log(`✅ Success: Generated ${generated.length} blueprints`);

    // 6. Generate Infrastructure Doc
    console.log(`🔨 Generating infrastructure blueprint...`);
    const infraFile = generateInfrastructureDoc(systemGraph, docsDir);
    console.log(`✅ Success: Generated ${infraFile}`);

    // 7. Generate Execution Sequence
    console.log(`🔨 Calculating implementation sequence...`);
    const sequence = systemGraph.getExecutionSequence();
    const sequenceFile = generateSequenceDoc(systemGraph, sequence, docsDir);
    console.log(`✅ Success: Generated ${sequenceFile}`);

    const defaultPersona = "expert full-stack developer specializing in Clean Architecture";
    let personaResponse = defaultPersona;

    const isNonInteractive = process.env.DSL_NON_INTERACTIVE === "true" || !process.stdin.isTTY;

    if (!isNonInteractive) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      personaResponse = await new Promise((resolve) => {
        rl.question(`\n🤖 Define the Target AI Persona [${defaultPersona}]: `, (answer) => {
          resolve(answer.trim() || defaultPersona);
          rl.close();
        });
      });
    } else {
      console.log(`\nℹ️  Non-interactive environment detected. Using default persona.`);
    }

    console.log(`🔨 Creating master onboarding prompt for: "${personaResponse}"...`);
    const promptFile = generateOnboardingPrompt(systemGraph, docsDir, personaResponse);
    console.log(`✅ Success: Generated ${promptFile}\n`);

    console.log(`🎉 READY FOR AI GENERATION PIPELINE!`);
    process.exit(0);

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

main().catch(err => {
  console.error("Fatal error during execution:", err);
  process.exit(1);
});
