class Singleton {
    private static instance: Singleton;
    private counter: number = 0;

    private constructor() {
        // Private constructor to prevent instantiation
    }

    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    public incrementCounter(): void {
        this.counter++;
    }

    public getCounter(): number {
        return this.counter;
    }
}

// Example usage:
const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();

singleton1.incrementCounter();
singleton1.incrementCounter();

console.log(singleton1.getCounter()); // Output: 2
console.log(singleton2.getCounter()); // Output: 2 (same instance as singleton1)




// Method 2 : ES 6 Module Pattern
// In ES6, you can create a singleton using a module pattern. 
// The module will export an instance of the class, ensuring that only one instance exists.

class SingletonES6 {
    private counter: number = 0;

    public incrementCounter(): void {
        this.counter++;
    }

    public getCounter(): number {
        return this.counter;
    }
}

const singletonInstance = new SingletonES6();
export default singletonInstance;

// Example usage in another file:
// import singleton from './singleton';
// singleton.incrementCounter();
// console.log(singleton.getCounter()); // Output: 1
// In this example, the `singletonInstance` is created once and exported. Any file that imports this module will receive the same instance, ensuring that the singleton pattern is maintained.