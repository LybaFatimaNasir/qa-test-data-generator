import { DatabaseAdapter, SeedRecord } from '../adapters/DatabaseAdapter';

export class SeederRegistry {
  private records: SeedRecord[] = [];

  constructor(private adapter: DatabaseAdapter) {}

  async seed<T extends { id?: any }>(table: string, data: T): Promise<T> {
    const record = await this.adapter.insert(table, data);
    this.records.push(record);
    return data;
  }

  async seedBatch<T extends { id?: any }>(table: string, dataList: T[]): Promise<T[]> {
    const insertedRecords = await this.adapter.insertBatch(table, dataList);
    this.records.push(...insertedRecords);
    return dataList;
  }

  async cleanup(): Promise<void> {
    const toDelete = [...this.records].reverse();
    for (const item of toDelete) {
      try {
        await this.adapter.delete(item.tableOrCollection, item.id);
      } catch (err) {
        console.warn(`Failed to cleanup record ${item.tableOrCollection}:${item.id}`, err);
      }
    }
    this.records = [];
  }

  getSeededRecords(): ReadonlyArray<SeedRecord> {
    return [...this.records];
  }
}
