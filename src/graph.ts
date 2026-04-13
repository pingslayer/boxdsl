import { Architecture, Box } from "./schema";

export class SystemGraph {
  private boxes: Map<string, Box>;
  public globalConstraints: string[];
  public infrastructure: string[];
  public systemName: string;

  constructor(architecture: Architecture) {
    this.systemName = architecture.system;
    this.globalConstraints = architecture.global?.constraints || [];
    this.infrastructure = architecture.global?.infrastructure || [];
    
    // Create a fast lookup dictionary (Map) for our boxes
    this.boxes = new Map();
    
    for (const box of architecture.boxes) {
      if (this.boxes.has(box.name)) {
         throw new Error(`Duplicate box name detected: ${box.name}`);
      }
      this.boxes.set(box.name, box);
    }
  }

  /**
   * Fast lookup to get a Box by its exact name.
   */
  public getBox(name: string): Box | undefined {
    return this.boxes.get(name);
  }

  /**
   * Calculates the optimal implementation sequence using a Topological Sort (Kahn's Algorithm).
   * Returns an array of "Implementation Layers" (e.g., [[Repos], [Services], [Adapters]]).
   */
  public getExecutionSequence(): string[][] {
    const sequence: string[][] = [];
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();
    const boxNames = Array.from(this.boxes.keys());

    // 1. Initialize data structures
    boxNames.forEach((name) => {
      inDegree.set(name, 0);
      adjacencyList.set(name, []);
    });

    // 2. Build adjacency list (inverted depends_on for forward flow)
    // If A depends on B, the flow is B -> A (B must be built before A)
    this.boxes.forEach((box, name) => {
      box.depends_on.forEach((dependency) => {
        const neighbors = adjacencyList.get(dependency) || [];
        neighbors.push(name);
        adjacencyList.set(dependency, neighbors);
        inDegree.set(name, (inDegree.get(name) || 0) + 1);
      });
    });

    // 3. Layered BFS (Kahn's)
    let currentLayer = boxNames.filter((name) => inDegree.get(name) === 0);

    while (currentLayer.length > 0) {
      sequence.push(currentLayer);
      const nextLayer: string[] = [];

      currentLayer.forEach((node) => {
        const neighbors = adjacencyList.get(node) || [];
        neighbors.forEach((neighbor) => {
          inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
          if (inDegree.get(neighbor) === 0) {
            nextLayer.push(neighbor);
          }
        });
      });

      currentLayer = nextLayer;
    }

    return sequence;
  }

  /**
   * Returns all boxes in the entire system graph.
   */
  public getAllBoxes(): Box[] {
    return Array.from(this.boxes.values());
  }

  /**
   * Returns a list of all box names in the graph.
   */
  public getBoxNames(): string[] {
    return Array.from(this.boxes.keys());
  }

  /**
   * Returns a box with global constraints merged into its local constraints.
   */
  public getMergedBox(name: string): Box | undefined {
    const box = this.getBox(name);
    if (!box) return undefined;

    return {
      ...box,
      constraints: [...new Set([...this.globalConstraints, ...box.constraints])]
    };
  }
}
