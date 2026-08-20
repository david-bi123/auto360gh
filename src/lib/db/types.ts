export type QueryValue = string | number | boolean | Date | null;

export interface QueryOperator {
  $in?: QueryValue[];
  $ne?: QueryValue;
  $gte?: number | Date;
  $lte?: number | Date;
  $regex?: string;
  $options?: string;
}

export type Query = Record<string, QueryValue | QueryOperator | RegExp>;

export interface FindOptions {
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
}

export interface Doc {
  _id: string;
}

export interface Collection<T extends Doc> {
  readonly name: string;
  find(query?: Query, opts?: FindOptions): Promise<T[]>;
  findOne(query: Query): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  insertOne(doc: Omit<T, "_id"> & { _id?: string }): Promise<T>;
  insertMany(docs: (Omit<T, "_id"> & { _id?: string })[]): Promise<T[]>;
  updateOne(query: Query, update: Partial<T>): Promise<T | null>;
  updateById(id: string, update: Partial<T>): Promise<T | null>;
  deleteOne(query: Query): Promise<boolean>;
  deleteById(id: string): Promise<boolean>;
  count(query?: Query): Promise<number>;
  exists(query: Query): Promise<boolean>;
  distinct(field: string, query?: Query): Promise<string[]>;
}

export function matches(doc: Record<string, unknown>, query: Query): boolean {
  for (const [key, cond] of Object.entries(query)) {
    if (key === "$or" && Array.isArray(cond)) {
      const ok = (cond as Query[]).some((sub) => matches(doc, sub));
      if (!ok) return false;
      continue;
    }
    const value = doc[key];
    if (cond instanceof RegExp) {
      if (typeof value !== "string" || !cond.test(value)) return false;
      continue;
    }
    if (cond && typeof cond === "object" && !(cond instanceof Date)) {
      const op = cond as QueryOperator;
      if (op.$in) {
        const hay = Array.isArray(value) ? value : [value];
        if (!hay.some((v) => op.$in!.some((i) => i === v))) return false;
      }
      if (op.$ne !== undefined) {
        if (value === op.$ne) return false;
        continue;
      }
      if (op.$gte !== undefined) {
        const v = value instanceof Date ? value.getTime() : (value as number);
        const t = op.$gte instanceof Date ? op.$gte.getTime() : op.$gte;
        if (v < t) return false;
        continue;
      }
      if (op.$lte !== undefined) {
        const v = value instanceof Date ? value.getTime() : (value as number);
        const t = op.$lte instanceof Date ? op.$lte.getTime() : op.$lte;
        if (v > t) return false;
        continue;
      }
      if (op.$regex !== undefined) {
        const re = new RegExp(op.$regex, op.$options || "i");
        if (typeof value !== "string" || !re.test(value)) return false;
        continue;
      }
      if (Object.keys(op).length === 0) continue;
      continue;
    }
    if (value !== cond) return false;
  }
  return true;
}

export function compareValues(a: unknown, b: unknown): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (a instanceof Date) a = a.getTime();
  if (b instanceof Date) b = b.getTime();
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export function newId(prefix = "id"): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${ts}${rand}`;
}