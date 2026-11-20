export class EnvVarExporter {
  static setRunnerEnv(prefix: string, data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      const formattedKey = `${prefix}_${key}`.toUpperCase();
      process.env[formattedKey] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    });
  }

  static getRunnerEnv<T = string>(key: string): T | undefined {
    return process.env[key] as unknown as T;
  }
}
