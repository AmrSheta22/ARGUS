export type Dto<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export function toDto<T extends object>(row: T): Dto<T> {
  const dto: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    dto[key] = value instanceof Date ? value.toISOString() : value;
  }
  return dto as Dto<T>;
}
