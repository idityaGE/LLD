// Factory Method Pattern Example: Database Connection System
//
// WHY FACTORY HERE?
// Database connections are stateful and disposable:
//   1. A connection is OPEN when created
//   2. You run queries on it
//   3. You CLOSE it when done — it can't be reused after closing
//
// If you pass a single connection object around, the second operation
// that tries to use it after close() will crash.
// The factory creates a fresh connection every time, solving this.

// #======= Product Interface =======#
interface DBConnection {
  connect(): void;
  query(sql: string): string[];
  close(): void;
}

// #======= Concrete Products (stateful — each has open/closed lifecycle) =======#
class PostgresConnection implements DBConnection {
  private isOpen = false;

  connect(): void {
    if (this.isOpen) throw new Error("Postgres: Already connected");
    this.isOpen = true;
    console.log("Postgres: Connection opened");
  }

  query(sql: string): string[] {
    if (!this.isOpen) throw new Error("Postgres: Connection is closed, cannot query");
    console.log(`Postgres: Executing → ${sql}`);
    return [`pg_result_for: ${sql}`];
  }

  close(): void {
    if (!this.isOpen) throw new Error("Postgres: Already closed");
    this.isOpen = false;
    console.log("Postgres: Connection closed");
  }
}

class MySQLConnection implements DBConnection {
  private isOpen = false;

  connect(): void {
    if (this.isOpen) throw new Error("MySQL: Already connected");
    this.isOpen = true;
    console.log("MySQL: Connection opened");
  }

  query(sql: string): string[] {
    if (!this.isOpen) throw new Error("MySQL: Connection is closed, cannot query");
    console.log(`MySQL: Executing → ${sql}`);
    return [`mysql_result_for: ${sql}`];
  }

  close(): void {
    if (!this.isOpen) throw new Error("MySQL: Already closed");
    this.isOpen = false;
    console.log("MySQL: Connection closed");
  }
}

class SQLiteConnection implements DBConnection {
  private isOpen = false;

  connect(): void {
    if (this.isOpen) throw new Error("SQLite: Already connected");
    this.isOpen = true;
    console.log("SQLite: Connection opened (in-memory)");
  }

  query(sql: string): string[] {
    if (!this.isOpen) throw new Error("SQLite: Connection is closed, cannot query");
    console.log(`SQLite: Executing → ${sql}`);
    return [`sqlite_result_for: ${sql}`];
  }

  close(): void {
    if (!this.isOpen) throw new Error("SQLite: Already closed");
    this.isOpen = false;
    console.log("SQLite: Connection closed");
  }
}

// #======= Abstract Factory =======#
// Shared logic: open connection → run query → close connection
// Subclasses only decide WHICH database to connect to.
abstract class DBConnectionFactory {
  abstract createConnection(): DBConnection;

  // Template method: handles the full lifecycle so callers don't have to.
  // Creates a FRESH connection every time — no reuse of closed connections.
  executeQuery(sql: string): string[] {
    const conn = this.createConnection(); // fresh instance
    conn.connect();
    const results = conn.query(sql);
    conn.close(); // connection is now dead — but that's fine, next call gets a new one
    return results;
  }
}

// #======= Concrete Factories =======#
class PostgresConnectionFactory extends DBConnectionFactory {
  createConnection(): DBConnection {
    return new PostgresConnection();
  }
}

class MySQLConnectionFactory extends DBConnectionFactory {
  createConnection(): DBConnection {
    return new MySQLConnection();
  }
}

class SQLiteConnectionFactory extends DBConnectionFactory {
  createConnection(): DBConnection {
    return new SQLiteConnection();
  }
}

// #======= Client Code =======#
// UserRepository doesn't know which DB it's talking to.
// It just uses the factory — swap the DB by changing one line.
class UserRepository {
  constructor(private dbFactory: DBConnectionFactory) {}

  findUserById(id: number): string[] {
    return this.dbFactory.executeQuery(`SELECT * FROM users WHERE id = ${id}`);
  }

  getAllUsers(): string[] {
    return this.dbFactory.executeQuery("SELECT * FROM users");
  }

  deleteUser(id: number): string[] {
    return this.dbFactory.executeQuery(`DELETE FROM users WHERE id = ${id}`);
  }
}

// --- Usage ---
// Decide the DB once at startup. Everything else is decoupled.
const pgRepo = new UserRepository(new PostgresConnectionFactory());
console.log(pgRepo.findUserById(1));
// Postgres: Connection opened
// Postgres: Executing → SELECT * FROM users WHERE id = 1
// Postgres: Connection closed

console.log(pgRepo.getAllUsers());
// Works fine — gets a FRESH connection, not the closed one from above

// Swap to MySQL by changing ONE line
const mysqlRepo = new UserRepository(new MySQLConnectionFactory());
console.log(mysqlRepo.findUserById(1));

// Use SQLite for tests — zero changes to UserRepository
const testRepo = new UserRepository(new SQLiteConnectionFactory());
console.log(testRepo.findUserById(1));

// --- WHY NOT JUST PASS THE INTERFACE DIRECTLY? ---
// This would break:
//
//   const conn = new PostgresConnection();
//   conn.connect();
//   conn.query("SELECT ...");
//   conn.close();
//   conn.query("SELECT ...");  // THROWS: "Connection is closed, cannot query"
//
// The factory avoids this because executeQuery() creates a new connection
// every time it's called. The caller never touches connection lifecycle.

// --- WHY NOT JUST new PostgresConnection() EVERYWHERE? ---
// Because then every function that touches the DB is hardcoded to Postgres:
//
//   class UserRepository {
//     findUserById(id: number) {
//       const conn = new PostgresConnection();  // hardcoded
//       conn.connect();
//       const result = conn.query(`SELECT ...`);
//       conn.close();
//       return result;
//     }
//   }
//
// Want to switch to MySQL? Change every method.
// Want SQLite for tests? Can't — it's baked in.
// With the factory, you change ONE constructor argument.
