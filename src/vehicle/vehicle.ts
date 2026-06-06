import { randomUUID } from "crypto";

export class Vehicle {
  private constructor(
    readonly id: string,
    readonly license_plate: string,
    readonly chassis: string,
    readonly renavam: string,
    readonly year: number,
    readonly model_id: string,
    readonly created_by_id: string,
    readonly created_at?: Date,
    readonly updated_at?: Date,
  ) {}

  static create(
    license_plate: string,
    chassis: string,
    renavam: string,
    year: number,
    model_id: string,
    created_by_id: string
  ) {
    const id = randomUUID();
    return new Vehicle(
      id,
      license_plate,
      chassis,
      renavam,
      year,
      model_id,
      created_by_id
    );
  }

  static restore(
    id: string,
    license_plate: string,
    chassis: string,
    renavam: string,
    year: number,
    model_id: string,
    created_by_id: string,
    created_at?: Date,
    updated_at?: Date
  ) {
    return new Vehicle(
      id,
      license_plate,
      chassis,
      renavam,
      year,
      model_id,
      created_by_id,
      created_at,
      updated_at
    );
  }
}
