#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { runEngine } from "./index";

const program = new Command();

program
  .name("boxdsl")
  .description("BoxDSL Architecture Orchestrator CLI")
  .version("1.1.0");

program
  .command("init")
  .description("Initialize the BoxDSL architecture folder in the current project")
  .action(() => {
    const cwd = process.cwd();
    const boxdslDir = path.join(cwd, "boxdsl");

    if (fs.existsSync(boxdslDir)) {
      console.warn(`⚠️  BoxDSL is already initialized at: ${boxdslDir}`);
      process.exit(0);
    }

    console.log(`📦 Initializing BoxDSL in ${boxdslDir}...`);
    fs.mkdirSync(boxdslDir, { recursive: true });

    const reqDir = path.join(boxdslDir, "requirements");
    fs.mkdirSync(reqDir, { recursive: true });

    // Dummy requirement
    const reqBody = `# Business Objectives\n\nDescribe your core business goals here. The AI will read this before generating code.\n`;
    fs.writeFileSync(path.join(reqDir, "Business_Objectives.md"), reqBody, "utf-8");

    // Boilerplate architecture.yaml
    const yamlBody = `system: "ProjectName"
global:
  constraints:
    - "Use Clean Architecture"
  infrastructure:
    - "Node.js 20"
    - "PostgreSQL 15"

boxes:
  - name: "CoreRepository"
    type: "repository"
    responsibility: "Handles database operations."
    depends_on: []
    inputs: ["Data"]
    outputs: ["DataResult"]
`;
    fs.writeFileSync(path.join(boxdslDir, "architecture.yaml"), yamlBody, "utf-8");

    console.log("✅ BoxDSL initialized successfully!");
    console.log("👉 Next steps:");
    console.log("   1. Edit boxdsl/architecture.yaml");
    console.log("   2. Add specs to boxdsl/requirements/");
    console.log("   3. Run `npx boxdsl start`");
  });

program
  .command("start")
  .description("Run the BoxDSL engine to generate blueprints")
  .action(async () => {
    const cwd = process.cwd();
    const yamlPath = path.join(cwd, "boxdsl", "architecture.yaml");
    const docsDir = path.join(cwd, "boxdsl", "docs");

    try {
      await runEngine(yamlPath, docsDir);
    } catch (err: any) {
      console.error(err.message || err);
      process.exit(1);
    }
  });

program.parse(process.argv);
