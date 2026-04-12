import { SystemGraph } from "./graph";

export function validateDependencies(graph: SystemGraph): void {
  const allBoxes = graph.getAllBoxes();
  const errors: string[] = [];

  // --- 1. Existence Check ---
  for (const box of allBoxes) {
    for (const dep of box.depends_on) {
      if (!graph.getBox(dep)) {
        errors.push(`❌ Missing dependency: Box '${box.name}' depends on '${dep}', but '${dep}' does not exist.`);
      }
    }
  }

  // If there are missing dependencies, we stop here because checking cycles on broken maps is unstable
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  // --- 2. Cycle Detection (Depth-First Search) ---
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function dfsTrace(currentName: string, path: string[]) {
    // If the node is currently in our 'visiting' set, we've walked in a circle!
    if (visiting.has(currentName)) {
      // Find where the cycle actually started in our trail
      const cycleStartIndex = path.indexOf(currentName);
      const cyclicPath = path.slice(cycleStartIndex);
      cyclicPath.push(currentName); // Add it to the end to visually close the loop
      
      errors.push(`❌ Circular dependency detected: ${cyclicPath.join(" → ")}`);
      return;
    }

    // If we've already cleared this node completely in the past, no need to re-check
    if (visited.has(currentName)) {
      return;
    }

    // Mark as currently visiting
    visiting.add(currentName);
    path.push(currentName);

    const box = graph.getBox(currentName);
    if (box) {
      for (const dep of box.depends_on) {
        dfsTrace(dep, [...path]); // copy the path array so branches don't mix
      }
    }

    // We finished visiting this node and all its children. Move it to the cleared 'visited' pile.
    visiting.delete(currentName);
    visited.add(currentName);
  }

  // Run the trace from every box
  for (const box of allBoxes) {
    if (!visited.has(box.name)) {
      dfsTrace(box.name, []);
    }
  }

  // Output all circular dependency errors if we found any
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
