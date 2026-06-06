import { Vehicle } from "./vehicle";

export abstract class VehicleRepository {
  abstract findById(id: string): Promise<Vehicle | null>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract create(vehicle: Vehicle): Promise<void>;
  abstract update(vehicle: Vehicle): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByLicensePlate(license_plate: string): Promise<Vehicle | null>;
}
