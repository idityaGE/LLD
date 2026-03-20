class SQLQuery {
  private table: string;
  private fields: string[]
  private conditions: string[];
  private orderBy: string;
  private orderDirection: 'ASC' | 'DESC';
  private limit: number;
  private offset: number;

  constructor(builder: SQLQueryBuilder) {
    this.table = builder.table;
    this.fields = builder.fields;
    this.conditions = builder.conditions;
    this.orderBy = builder.orderBy;
    this.orderDirection = builder.orderDir;
    this.limit = builder.limit;
    this.offset = builder.offset;
  }

  public toString(): string {
    let query = `SELECT ${this.fields.join(', ')} FROM ${this.table}`;

    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }

    if (this.orderBy) {
      query += ` ORDER BY ${this.orderBy} ${this.orderDirection || 'ASC'}`;
    }

    if (this.limit) {
      query += ` LIMIT ${this.limit}`;
    }

    if (this.offset) {
      query += ` OFFSET ${this.offset}`;
    }

    return query + ';';
  }

  static Builder = class SQLQueryBuilder {
    table: string;
    fields: string[] = []
    conditions: string[] = [];
    orderBy: string = '';
    orderDir: 'ASC' | 'DESC' = 'ASC';
    limit: number = 0;
    offset: number = 0;

    constructor(table: string) {
      this.table = table;
    }

    select(...fields: string[]): this {
      this.fields.push(...fields);
      return this;
    }

    where(condition: string): this {
      this.conditions.push(condition);
      return this;
    }

    orderByField(field: string): this {
      this.orderBy = field;
      return this;
    }

    orderDirection(direction: 'ASC' | 'DESC'): this {
      this.orderDir = direction;
      return this;
    }

    limitResults(limit: number): this {
      this.limit = limit;
      return this;
    }

    offsetResults(offset: number): this {
      this.offset = offset;
      return this;
    }

    build(): SQLQuery {
      return new SQLQuery(this);
    }
  }
}


// Example usage:
const query = new SQLQuery.Builder('users')
  .select('id', 'name', 'email')
  .where('age > 18')
  .where('status = "active"')
  .orderByField('name')
  .orderDirection('ASC')
  .limitResults(10)
  .offsetResults(5)
  .build();

console.log(query.toString());
// Output: SELECT id, name, email FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10 OFFSET 5

const query2 = new SQLQuery.Builder('products')
  .select('name', 'price')
  .where('price > 100')
  .orderByField('price')
  .build();

console.log(query2.toString());
// Output: SELECT name, price FROM products WHERE price > 100