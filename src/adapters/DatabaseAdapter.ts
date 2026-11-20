export interface SeedRecord {
  tableOrCollection: string;
  id: string | number;
}

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  insert<T>(tableOrCollection: string, record: T): Promise<SeedRecord>;
  insertBatch<T>(tableOrCollection: string, records: T[]): Promise<SeedRecord[]>;
  delete(tableOrCollection: string, id: string | number): Promise<void>;
  beginTransaction?(): Promise<void>;
  rollbackTransaction?(): Promise<void>;
}
