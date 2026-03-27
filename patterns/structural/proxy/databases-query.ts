interface DatabaseService {
  query(sql: string): Promise<string>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RealDatabaseService implements DatabaseService {
  async query(sql: string): Promise<string> {
    await delay(1000); // Simulate delay
    return `Result for query: ${sql}`;
  }
}

class DatabaseProxy implements DatabaseService {
  private realService: RealDatabaseService;
  private cache: Map<string, string>;

  constructor() {
    this.realService = new RealDatabaseService();
    this.cache = new Map();
  }

  async query(sql: string): Promise<string> {
    if (this.cache.has(sql)) {
      console.log('Cache hit for query:', sql);
      return this.cache.get(sql)!;
    }
    console.log('Cache miss for query:', sql);
    const result = await this.realService.query(sql);
    this.cache.set(sql, result);
    return result;
  }

  clearCache() {
    this.cache.clear();
  }
}


// Usage
const dbProxy = new DatabaseProxy();

console.log(await dbProxy.query('SELECT * FROM users'));
console.log(await dbProxy.query('SELECT * FROM users')); // This will hit the cache

console.log(await dbProxy.query('SELECT * FROM orders'));
console.log(await dbProxy.query('SELECT * FROM orders')); // This will hit the cache

dbProxy.clearCache();

console.log(await dbProxy.query('SELECT * FROM users')); // Cache cleared, will miss again
