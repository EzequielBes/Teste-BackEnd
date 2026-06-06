import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { VehicleEntity } from "../database/vehicle.entity";
import { Vehicle } from "../vehicle/vehicle";
import { VehicleRepository } from "../vehicle/vehicle.repository";

@Injectable()
export class VehicleRepositoryTypeorm implements VehicleRepository {
  private readonly repository: Repository<VehicleEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(VehicleEntity);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const v = await this.repository.findOne({ where: { id } });
    if (!v) return null;
    return Vehicle.restore(
      v.id,
      v.license_plate,
      v.chassis,
      v.renavam,
      v.year,
      v.model_id,
      v.created_by_id,
      v.created_at,
      v.updated_at
    );
  }

  async findByLicensePlate(license_plate: string): Promise<Vehicle | null> {
    const v = await this.repository.findOne({ where: { license_plate } });
    if (!v) return null;
    return Vehicle.restore(
      v.id,
      v.license_plate,
      v.chassis,
      v.renavam,
      v.year,
      v.model_id,
      v.created_by_id,
      v.created_at,
      v.updated_at
    );
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.repository.find();
    return vehicles.map((v) =>
      Vehicle.restore(
        v.id,
        v.license_plate,
        v.chassis,
        v.renavam,
        v.year,
        v.model_id,
        v.created_by_id,
        v.created_at,
        v.updated_at
      )
    );
  }

  async create(vehicle: Vehicle): Promise<void> {
    const vehicleToBeCreated = this.repository.create({
      id: vehicle.id,
      license_plate: vehicle.license_plate,
      chassis: vehicle.chassis,
      renavam: vehicle.renavam,
      year: vehicle.year,
      model_id: vehicle.model_id,
      created_by_id: vehicle.created_by_id,
    });
    await this.repository.save(vehicleToBeCreated);
  }

  async update(vehicle: Vehicle): Promise<void> {
    await this.repository.save({
      id: vehicle.id,
      license_plate: vehicle.license_plate,
      chassis: vehicle.chassis,
      renavam: vehicle.renavam,
      year: vehicle.year,
      model_id: vehicle.model_id,
      created_by_id: vehicle.created_by_id,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
