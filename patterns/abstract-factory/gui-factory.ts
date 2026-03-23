import process from "node:process";

interface Button {
  paint(): void;
  onClick(): void;
}

interface Checkbox {
  paint(): void;
  onSelect(): void;
}

class WindowsButton implements Button {
  paint(): void {
    console.log("Painting a Windows-style button.");
  }

  onClick(): void {
    console.log("Windows button clicked.");
  }
}

class WindowsCheckbox implements Checkbox {
  paint(): void {
    console.log("Painting a Windows-style checkbox.");
  }

  onSelect(): void {
    console.log("Windows checkbox selected.");
  }
}

class MacOSButton implements Button {
  paint(): void {
    console.log("Painting a macOS-style button.");
  }

  onClick(): void {
    console.log("macOS button clicked.");
  }
}

class MacOSCheckbox implements Checkbox {
  paint(): void {
    console.log("Painting a macOS-style checkbox.");
  }

  onSelect(): void {
    console.log("macOS checkbox selected.");
  }
}

interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WindowsFactory implements GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }

  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

class MacOSFactory implements GUIFactory {
  createButton(): Button {
    return new MacOSButton();
  }

  createCheckbox(): Checkbox {
    return new MacOSCheckbox();
  }
}

class Application {
  private readonly button: Button;
  private readonly checkbox: Checkbox;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }

  renderUI(): void {
    this.button.paint();
    this.checkbox.paint();
  }
}

class AppLauncher {
  static main(): void {
    // Simulate platform detection
    const os = process.platform;
    let factory: GUIFactory;

    if (os === "win32") {
      factory = new WindowsFactory();
    } else {
      factory = new MacOSFactory();
    }

    const app = new Application(factory);
    app.renderUI();
  }
}

AppLauncher.main();