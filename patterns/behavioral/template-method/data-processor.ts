// ─── Abstract Base Class ───────────────────────────────────────────────────

abstract class DataProcessor {
  // Template Method — defines the algorithm skeleton
  // Subclasses must NOT override this
  process(): void {
    const raw = this.readData();
    const parsed = this.parseData(raw);
    const valid = this.validateData(parsed);

    if (!valid) {
      console.log("Validation failed. Aborting.");
      return;
    }

    this.processData(parsed);
    this.saveResults(parsed);
    this.onComplete(); // hook
  }

  // Abstract steps — subclasses MUST implement
  protected abstract readData(): string;
  protected abstract parseData(raw: string): Record<string, unknown>[];
  protected abstract saveResults(data: Record<string, unknown>[]): void;

  // Concrete step — shared logic, same for everyone
  protected validateData(data: Record<string, unknown>[]): boolean {
    console.log(`Validating ${data.length} records...`);
    return data.length > 0;
  }

  protected processData(data: Record<string, unknown>[]): void {
    console.log(`Processing ${data.length} records...`);
  }

  // Hook — subclasses MAY override, but don't have to
  protected onComplete(): void {
    console.log("Done.\n");
  }
}


// ─── Concrete Implementation: CSV ──────────────────────────────────────────

class CsvDataProcessor extends DataProcessor {
  protected readData(): string {
    console.log("Reading CSV file...");
    return "name,age\nAlice,30\nBob,25"; // simulated
  }

  protected parseData(raw: string): Record<string, unknown>[] {
    console.log("Parsing CSV...");
    const [headerLine, ...rows] = raw.split("\n");
    const headers = headerLine.split(",");

    return rows.map((row) => {
      const values = row.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });
  }

  protected saveResults(data: Record<string, unknown>[]): void {
    console.log(`Saving ${data.length} records to database...`);
  }

  // Overriding the hook
  protected onComplete(): void {
    console.log("CSV pipeline finished. Sending success email.\n");
  }
}


// ─── Concrete Implementation: JSON ─────────────────────────────────────────

class JsonDataProcessor extends DataProcessor {
  protected readData(): string {
    console.log("Fetching JSON from API...");
    return JSON.stringify([{ name: "Charlie", age: 35 }]); // simulated
  }

  protected parseData(raw: string): Record<string, unknown>[] {
    console.log("Parsing JSON...");
    return JSON.parse(raw);
  }

  protected saveResults(data: Record<string, unknown>[]): void {
    console.log(`Pushing ${data.length} records to data warehouse...`);
  }

  // Does NOT override onComplete — uses the default hook
}


// ─── Client Code ───────────────────────────────────────────────────────────

const processors: DataProcessor[] = [
  new CsvDataProcessor(),
  new JsonDataProcessor(),
];

for (const processor of processors) {
  processor.process();
}
