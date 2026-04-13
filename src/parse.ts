import { parse as parseYaml } from "yaml";
import { ArchitectureSchema, Architecture } from "./schema";

/**
 * Parses raw YAML string into a strict Architecture object.
 * Throws an error if the YAML doesn't match the schema rules.
 */
export function parseArchitecture(yamlContent: string): Architecture {
  // 1. Convert raw text into a loose Javascript object
  const rawData = parseYaml(yamlContent);
  
  if (!rawData || typeof rawData !== "object") {
    throw new Error("The architecture file is empty or contains an invalid structure.");
  }

  // 2. Pass it through our Zod schema. 
  // 'parse' will throw a detailed Error if it detects missing fields or wrong types.
  const validatedData = ArchitectureSchema.parse(rawData);

  return validatedData;
}
