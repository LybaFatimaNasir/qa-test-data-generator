import { DatabaseAdapter, SeedRecord } from './DatabaseAdapter';

export class PostgresAdapter implements DatabaseAdapter {
  constructor(private poolOrClient: any) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async beginTransaction(): Promise<void> {
    await this.poolOrClient.query('BEGIN');
  }

  async rollbackTransaction(): Promise<void> {
    await this.poolOrClient.query('ROLLBACK');
  }

  async insert<T extends Record<string, any>>(table: string, record: T): Promise<SeedRecord> {
    const keys = Object.keys(record);
    const values = Object.values(record);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;
    
    const res = await this.poolOrClient.query(query, values);
    const id = res.rows[0]?.id ?? record.id;
    return { tableOrCollection: table, id };
  }

  async insertBatch<T extends Record<string, any>>(table: string, records: T[]): Promise<SeedRecord[]> {
    const results: SeedRecord[] = [];
    for (const item of records) {
      results.push(await this.insert(table, item));
    }
    return results;
  }

  async delete(table: string, id: string | number): Promise<void> {
    await this.poolOrClient.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  }
}
