// Bridge Pattern : This pattern decouples an abstraction from its implementation, allowing them to vary independently. It is useful when you want to avoid a permanent binding between an abstraction and its implementation.

// Implementor
interface Renderer {
  renderCircle(radius: number): void;
  renderRectangle(width: number, height: number): void;
}

// Concrete Implementor 1
class VectorRenderer implements Renderer {
  renderCircle(radius: number): void {
    console.log(`Drawing a circle with radius ${radius} using vector graphics.`);
  }

  renderRectangle(width: number, height: number): void {
    console.log(`Drawing a rectangle with width ${width} and height ${height} using vector graphics.`);
  }
}

// Concrete Implementor 2
class RasterRenderer implements Renderer {
  renderCircle(radius: number): void {
    console.log(`Drawing a circle with radius ${radius} using raster graphics.`);
  }

  renderRectangle(width: number, height: number): void {
    console.log(`Drawing a rectangle with width ${width} and height ${height} using raster graphics.`);
  }
}

// Abstraction
abstract class Shape {
  protected renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  abstract draw(): void;
}

// Refined Abstraction
class Circle extends Shape {
  private radius: number;

  constructor(renderer: Renderer, radius: number) {
    super(renderer);
    this.radius = radius;
  }

  draw(): void {
    this.renderer.renderCircle(this.radius);
  }
}

// Refined Abstraction
class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(renderer: Renderer, width: number, height: number) {
    super(renderer);
    this.width = width;
    this.height = height;
  }

  draw(): void {
    this.renderer.renderRectangle(this.width, this.height);
  }
}

// Client code
const vectorRenderer = new VectorRenderer();
const rasterRenderer = new RasterRenderer();

const circle = new Circle(vectorRenderer, 5);
const rectangle = new Rectangle(rasterRenderer, 10, 20);

circle.draw();
rectangle.draw();