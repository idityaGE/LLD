import process from "node:process";

interface TextView {
  render(): string;
}

class PlainTextView implements TextView {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  public render(): string {
    return this.text;
  }
}

abstract class TextViewDecorator implements TextView {
  protected readonly decoratedView: TextView;

  constructor(decoratedView: TextView) {
    this.decoratedView = decoratedView;
  }

  public abstract render(): string;
}

class BoldTextView extends TextViewDecorator {
  constructor(decoratedView: TextView) {
    super(decoratedView);
  }

  public render(): string {
    return `**${this.decoratedView.render()}**`;
  }
}

class ItalicTextView extends TextViewDecorator {
  constructor(decoratedView: TextView) {
    super(decoratedView);
  }

  public render(): string {
    return `*${this.decoratedView.render()}*`;
  }
}

class UnderlineTextView extends TextViewDecorator {
  constructor(decoratedView: TextView) {
    super(decoratedView);
  }

  public render(): string {
    return `__${this.decoratedView.render()}__`;
  }
}

// Example usage:
const textView: TextView = new UnderlineTextView(new ItalicTextView(new BoldTextView(new PlainTextView("Hello, World!"))));
process.stdout.write(textView.render());
console.log("\n");


const plainTextView: TextView = new PlainTextView("Hello, World!");
process.stdout.write(plainTextView.render());
console.log("\n");

const boldTextView: TextView = new BoldTextView(plainTextView);
process.stdout.write(boldTextView.render());
console.log("\n");

const italicTextView: TextView = new ItalicTextView(plainTextView);
process.stdout.write(italicTextView.render());
console.log("\n");

const underlineTextView: TextView = new UnderlineTextView(plainTextView);
process.stdout.write(underlineTextView.render());
console.log("\n");