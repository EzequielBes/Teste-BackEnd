import { randomUUID } from "crypto";

export class Brand {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly created_by_id: string,
    readonly created_at?: Date,
    readonly updated_at?: Date,
  ) {}

  static create(name: string, created_by_id: string) {
    const id = randomUUID();
    return new Brand(id, name, created_by_id);
  }

  static restore(
    id: string,
    name: string,
    created_by_id: string,
    created_at?: Date,
    updated_at?: Date,
  ) {
    return new Brand(id, name, created_by_id, created_at, updated_at);
  }
}
