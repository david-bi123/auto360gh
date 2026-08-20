import {
  compareValues,
  matches,
  newId,
  type Collection,
  type Doc,
  type FindOptions,
  type Query,
} from "./types";

export class MemoryCollection<T extends Doc> implements Collection<T> {
  readonly name: string;
  private docs: T[] = [];

  constructor(name: string, docs: T[] = []) {
    this.name = name;
    this.docs = docs;
  }

  get all(): T[] {
    return this.docs;
  }

  private sort(docs: T[], sort?: FindOptions["sort"]): T[] {
    if (!sort) return docs;
    const keys = Object.keys(sort);
    return [...docs].sort((a, b) => {
      for (const key of keys) {
        const dir = sort[key] === -1 ? -1 : 1;
        const av = (a as unknown as Record<string, unknown>)[key];
        const bv = (b as unknown as Record<string, unknown>)[key];
        const cmp = compareValues(av, bv) * dir;
        if (cmp !== 0) return cmp;
      }
      return 0;
    });
  }

  async find(query: Query = {}, opts: FindOptions = {}): Promise<T[]> {
    let result = this.docs.filter((d) => matches(d as unknown as Record<string, unknown>, query));
    result = this.sort(result, opts.sort);
    if (opts.skip) result = result.slice(opts.skip);
    if (opts.limit) result = result.slice(0, opts.limit);
    return result;
  }

  async findOne(query: Query): Promise<T | null> {
    return this.docs.find((d) => matches(d as unknown as Record<string, unknown>, query)) ?? null;
  }

  async findById(id: string): Promise<T | null> {
    return this.docs.find((d) => d._id === id) ?? null;
  }

  async insertOne(doc: (Omit<T, "_id"> & { _id?: string }) | T): Promise<T> {
    const full = { ...doc, _id: (doc as { _id?: string })._id || newId(this.name) } as T;
    this.docs.push(full);
    return full;
  }

  async insertMany(docs: (Omit<T, "_id"> & { _id?: string })[]): Promise<T[]> {
    const inserted: T[] = [];
    for (const d of docs) inserted.push(await this.insertOne(d));
    return inserted;
  }

  async updateOne(query: Query, update: Partial<T>): Promise<T | null> {
    const idx = this.docs.findIndex((d) => matches(d as unknown as Record<string, unknown>, query));
    if (idx === -1) return null;
    const prev = this.docs[idx];
    const next = { ...prev, ...update, _id: prev._id } as T;
    this.docs[idx] = next;
    return next;
  }

  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    return this.updateOne({ _id: id } as Query, update);
  }

  async deleteOne(query: Query): Promise<boolean> {
    const idx = this.docs.findIndex((d) => matches(d as unknown as Record<string, unknown>, query));
    if (idx === -1) return false;
    this.docs.splice(idx, 1);
    return true;
  }

  async deleteById(id: string): Promise<boolean> {
    return this.deleteOne({ _id: id } as Query);
  }

  async count(query: Query = {}): Promise<number> {
    return this.docs.filter((d) => matches(d as unknown as Record<string, unknown>, query)).length;
  }

  async exists(query: Query): Promise<boolean> {
    return this.docs.some((d) => matches(d as unknown as Record<string, unknown>, query));
  }

  async distinct(field: string, query: Query = {}): Promise<string[]> {
    const set = new Set<string>();
    for (const d of this.docs) {
      if (!matches(d as unknown as Record<string, unknown>, query)) continue;
      const v = (d as unknown as Record<string, unknown>)[field];
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") set.add(String(v));
    }
    return [...set];
  }

  replaceAll(docs: T[]) {
    this.docs = docs;
  }
}

export type MemoryStore = Record<string, MemoryCollection<any>>;

export const memoryStore: MemoryStore = {};

export function getMemoryCollection<T extends Doc>(name: string): MemoryCollection<T> {
  if (!memoryStore[name]) {
    memoryStore[name] = new MemoryCollection<T>(name);
  }
  return memoryStore[name] as MemoryCollection<T>;
}