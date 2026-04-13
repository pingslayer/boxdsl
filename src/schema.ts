import { z } from "zod";

// We define what a single Box looks like
export const BoxSchema = z.object({
  name: z.string(),
  type: z.enum(["service", "repository", "adapter"]),
  responsibility: z.string().optional(),
  
  // Custom constraints specific to this box
  constraints: z.array(z.string()).optional().default([]),
  
  // What this box depends on
  depends_on: z.array(z.string()).optional().default([]),
  
  inputs: z.array(z.string()).optional().default([]),
  outputs: z.array(z.string()).optional().default([])
});

// We define the global settings, which includes global constraints and infrastructure
export const GlobalSchema = z.object({
  constraints: z.array(z.string()).optional().default([]),
  infrastructure: z.array(z.string()).optional().default([])
});

// The final Architecture Schema pulls it all together
export const ArchitectureSchema = z.object({
  system: z.string(),
  global: GlobalSchema.optional(),
  boxes: z.array(BoxSchema)
});

// We can export TypeScript types automatically extracted from our Zod models!
export type Box = z.infer<typeof BoxSchema>;
export type Architecture = z.infer<typeof ArchitectureSchema>;
