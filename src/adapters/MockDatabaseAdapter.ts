import { DatabaseAdapter, SeedRecord } from './DatabaseAdapter';

export class MockDatabaseAdapter implements DatabaseAdapter {
  private store: Map<string, Map<string | number, any>> = new Map();

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {
    this.store.clear();
  }

  async insert<T extends Record<string, any>>(tableOrCollection: string, record: T): Promise<SeedRecord> {
    if (!this.store.has(tableOrCollection)) {
      this.store.set(tableOrCollection, new Map());
    }
    const id = record.id ?? `mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.store.get(tableOrCollection)!.set(id, { ...record, id });
    return { tableOrCollection, id };
  }

  async insertBatch<T extends Record<string, any>>(tableOrCollection: string, records: T[]): Promise<SeedRecord[]> {
    const results: SeedRecord[] = [];
    for (const item of records) {
      results.push(await this.insert(tableOrCollection, item));
    }
    return results;
  }

  async delete(tableOrCollection: string, id: string | number): Promise<void> {
    this.store.get(tableOrCollection)?.delete(id);
  }

  getRecord(tableOrCollection: string, id: string | number): any {
    return this.store.get(tableOrCollection)?.get(id);
  }
}
