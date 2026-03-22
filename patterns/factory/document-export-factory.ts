// Factory Method Pattern Example: Document Export System
// Objects are stateful and disposable — you can't reuse a document after exporting.
// This is why a factory is needed: it creates a fresh instance every time.

// #======= Product Interface =======#
interface ExportDocument {
  addTitle(title: string): void;
  addContent(content: string): void;
  export(): string;
}

// #======= Concrete Products (stateful — each export needs a fresh instance) =======#
class PdfDocument implements ExportDocument {
  private parts: string[] = [];
  private finalized = false;

  addTitle(title: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.parts.push(`%PDF-1.4 [TITLE] ${title}`);
  }

  addContent(content: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.parts.push(`%PDF-1.4 [BODY] ${content}`);
  }

  export(): string {
    this.finalized = true; // can't reuse this object anymore
    return this.parts.join("\n");
  }
}

class CsvDocument implements ExportDocument {
  private rows: string[] = [];
  private finalized = false;

  addTitle(title: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.rows.push(`# ${title}`);
  }

  addContent(content: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.rows.push(content);
  }

  export(): string {
    this.finalized = true;
    return this.rows.join("\n");
  }
}

class HtmlDocument implements ExportDocument {
  private elements: string[] = [];
  private finalized = false;

  addTitle(title: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.elements.push(`<h1>${title}</h1>`);
  }

  addContent(content: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.elements.push(`<p>${content}</p>`);
  }

  export(): string {
    this.finalized = true;
    return `<html><body>${this.elements.join("")}</body></html>`;
  }
}
// #======= Abstract Factory =======#
// Shared logic lives here — subclasses only decide WHICH document to create.
abstract class DocumentFactory {
  abstract createDocument(): ExportDocument;

  // This is the key: shared template logic that creates a fresh instance each call.
  // If we just passed an ExportDocument interface, the second call would throw
  // "Document already exported" because the object is consumed after export().
  generateReport(title: string, data: string): string {
    const doc = this.createDocument(); // fresh instance every time
    doc.addTitle(title);
    doc.addContent(data);
    return doc.export();
  }
}

// #======= Concrete Factories =======#
class PdfDocumentFactory extends DocumentFactory {
  createDocument(): ExportDocument {
    return new PdfDocument();
  }
}

class CsvDocumentFactory extends DocumentFactory {
  createDocument(): ExportDocument {
    return new CsvDocument();
  }
}

class HtmlDocumentFactory extends DocumentFactory {
  createDocument(): ExportDocument {
    return new HtmlDocument();
  }
}

// #======= Client Code =======#
// The ReportService doesn't know or care which document type it's using.
// It just calls factory.generateReport() — the factory handles creation.
class ReportService {
  constructor(private factory: DocumentFactory) {}

  weeklyReport(data: string): string {
    return this.factory.generateReport("Weekly Report", data);
  }

  monthlyReport(data: string): string {
    return this.factory.generateReport("Monthly Report", data);
  }
}

// --- Usage ---

// The concrete type is decided ONCE at configuration time
const pdfService = new ReportService(new PdfDocumentFactory());
console.log(pdfService.weeklyReport("Sales: $10k"));
// Each call creates a fresh PdfDocument internally — no reuse issues.
console.log(pdfService.monthlyReport("Sales: $42k"));

// Swap format by changing ONE line — nothing else in ReportService changes
const csvService = new ReportService(new CsvDocumentFactory());
console.log(csvService.weeklyReport("Sales, $10k"));

// --- Why not just pass the interface directly? ---
// This would break:
//   const doc = new PdfDocument();
//   const service = new BrokenReportService(doc);
//   service.weeklyReport("data");   // works
//   service.monthlyReport("data");  // throws "Document already exported"
// Because the document is stateful and consumed after export().
// The factory solves this by creating a new instance every time.

// --- Adding a new format (Open/Closed Principle) ---
// Just add a new product + factory. Zero changes to existing code.
class MarkdownDocument implements ExportDocument {
  private lines: string[] = [];
  private finalized = false;

  addTitle(title: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.lines.push(`# ${title}`);
  }

  addContent(content: string): void {
    if (this.finalized) throw new Error("Document already exported");
    this.lines.push(content);
  }

  export(): string {
    this.finalized = true;
    return this.lines.join("\n\n");
  }
}

class MarkdownDocumentFactory extends DocumentFactory {
  createDocument(): ExportDocument {
    return new MarkdownDocument();
  }
}

// Works immediately with ReportService — no modifications needed
const mdService = new ReportService(new MarkdownDocumentFactory());
console.log(mdService.weeklyReport("Sales: $10k"));
