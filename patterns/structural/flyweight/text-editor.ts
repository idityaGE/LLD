interface CharacterFlyweight {
  draw(x: number, y: number): void;
}

class CharacterGlyph implements CharacterFlyweight {
  private symbol: string;
  private fontFamily: string;
  private fontSize: number;
  private color: string;

  constructor(symbol: string, fontFamily: string, fontSize: number, color: string) {
    this.symbol = symbol;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.color = color;
  }

  draw(x: number, y: number): void {
    console.log(`Drawing '${this.symbol}' at (${x}, ${y}) with font '${this.fontFamily}', size ${this.fontSize}, color ${this.color}`);
  }
}

class CharacterFlyweightFactory {
  private flyweights: Map<string, CharacterFlyweight> = new Map();

  getFlyweight(symbol: string, fontFamily: string, fontSize: number, color: string): CharacterFlyweight {
    const key = `${symbol}_${fontFamily}_${fontSize}_${color}`;
    if (!this.flyweights.has(key)) {
      this.flyweights.set(key, new CharacterGlyph(symbol, fontFamily, fontSize, color));
    }
    return this.flyweights.get(key)!;
  }
}

class RendereredCharacter {
  private flyweight: CharacterFlyweight
  private x: number;
  private y: number;

  constructor(flyweight: CharacterFlyweight, x: number, y: number) {
    this.flyweight = flyweight;
    this.x = x;
    this.y = y;
  }

  draw(): void {
    this.flyweight.draw(this.x, this.y);
  }
}

// Client
class TextEditor {
  private factory: CharacterFlyweightFactory = new CharacterFlyweightFactory();
  private document: RendereredCharacter[] = [];

  addCharacter(symbol: string, fontFamily: string, fontSize: number, color: string, x: number, y: number): void {
    const flyweight = this.factory.getFlyweight(symbol, fontFamily, fontSize, color);
    const renderedCharacter = new RendereredCharacter(flyweight, x, y);
    this.document.push(renderedCharacter);
  }

  render(): void {
    for (const character of this.document) {
      character.draw();
    }
  }
}