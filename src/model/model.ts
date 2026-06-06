import { randomUUID } from "crypto";

export class Model {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly brand_id: string,
    readonly created_by_id: string,
    readonly created_at?: Date,
    readonly updated_at?: Date,
  ) {}

  static create(name: string, brand_id: string, created_by_id: string) {
    const id = randomUUID();
    return new Model(id, name, brand_id, created_by_id);
  }

  static restore(
    id: string,
    name: string,
    brand_id: string,
    created_by_id: string,
    created_at?: Date,
    updated_at?: Date,
  ) {
    return new Model(id, name, brand_id, created_by_id, created_at, updated_at);
  }
}
