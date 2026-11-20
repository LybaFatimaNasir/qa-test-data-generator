import { DatabaseAdapter, SeedRecord } from './DatabaseAdapter';

export class MongoAdapter implements DatabaseAdapter {
  constructor(private db: any) {}

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async insert<T extends Record<string, any>>(collectionName: string, record: T): Promise<SeedRecord> {
    const col = this.db.collection(collectionName);
    const res = await col.insertOne(record);
    const id = res.insertedId ?? record.id ?? record._id;
    return { tableOrCollection: collectionName, id };
  }

  async insertBatch<T extends Record<string, any>>(collectionName: string, records: T[]): Promise<SeedRecord[]> {
    const col = this.db.collection(collectionName);
    const res = await col.insertMany(records);
    return Object.values(res.insertedIds).map((id) => ({
      tableOrCollection: collectionName,
      id: id as string
    }));
  }

  async delete(collectionName: string, id: string | number): Promise<void> {
    const col = this.db.collection(collectionName);
    await col.deleteOne({ _id: id });
  }
}
