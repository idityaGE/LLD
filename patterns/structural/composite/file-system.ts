interface FileSystemItem {
  getSize(): number;
  getName(): string;
  delete(): void;
  print(indent: string): void;
}

class FileItem implements FileSystemItem {
  private name: string;
  private size: number;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }

  public getSize(): number {
    return this.size;
  }

  public getName(): string {
    return this.name;
  }

  public delete(): void {
    console.log(`Deleting file: ${this.name}`);
  }

  public print(indent: string = ""): void {
    console.log(`${indent}- ${this.name} (${this.size} bytes)`);
  }
}

class FolderItem implements FileSystemItem {
  private name: string;
  private items: FileSystemItem[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public getSize(): number {
    return this.items.reduce((total, item) => total + item.getSize(), 0);
  }

  public getName(): string {
    return this.name;
  }

  public delete(): void {
    console.log(`Deleting folder: ${this.name}`);
    this.items.forEach(item => item.delete());
    this.items = [];
  }

  public addItem(item: FileSystemItem): void {
    this.items.push(item);
  }

  public removeItem(item: FileSystemItem): void {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items[index].delete();
      this.items.splice(index, 1);
    }
  }

  public print(indent: string = ""): void {
    console.log(`${indent}+ ${this.name}/`);
    this.items.forEach(item => item.print(indent + "  "));
  }
}

// Example usage:
const rootFolder = new FolderItem("root");
const file1 = new FileItem("file1.txt", 100);
const file2 = new FileItem("file2.txt", 200);
const subFolder = new FolderItem("subfolder");
const file3 = new FileItem("file3.txt", 300);

rootFolder.addItem(file1);
rootFolder.addItem(file2);
rootFolder.addItem(subFolder);
subFolder.addItem(file3);

rootFolder.print();
console.log(`Total size: ${rootFolder.getSize()} bytes`);

subFolder.delete();
rootFolder.print();
console.log(`Total size after deletion: ${rootFolder.getSize()} bytes`);

// rootFolder.removeItem(file1);
// rootFolder.print();
// console.log(`Total size after removing file1: ${rootFolder.getSize()} bytes`);

// rootFolder.delete();
// rootFolder.print();
// console.log(`Total size after deleting root folder: ${rootFolder.getSize()} bytes`);