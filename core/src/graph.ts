import { Architecture, Box } from "./schema";

export class SystemGraph {
  private boxes: Map<string, Box>;
  public globalConstraints: string[];
  public systemName: string;

  constructor(architecture: Architecture) {
    this.systemName = architecture.system;
    this.globalConstraints = architecture.global?.constraints || [];
    
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
   * Returns all boxes in the entire system graph.
   */
  public getAllBoxes(): Box[] {
    return Array.from(this.boxes.values());
  }
}
