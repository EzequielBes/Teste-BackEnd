import { Injectable, NotFoundException, Inject, ConflictException } from "@nestjs/common";
import { VehicleRepository } from "./vehicle.repository";
import { Vehicle } from "./vehicle";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { ModelRepository } from "../model/model.repository";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class VehicleService {
  private readonly CACHE_KEY_ALL = "vehicles_all";

  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly modelRepository: ModelRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly auditService: AuditService
  ) {}

  async create(createVehicleDto: CreateVehicleDto, userId: string): Promise<void> {
    const model = await this.modelRepository.findById(createVehicleDto.model_id);
    if (!model) throw new NotFoundException("Model not found");

    const existing = await this.vehicleRepository.findByLicensePlate(createVehicleDto.license_plate);
    if (existing) throw new ConflictException("Vehicle with this license plate already exists");

    const vehicle = Vehicle.create(
      createVehicleDto.license_plate,
      createVehicleDto.chassis,
      createVehicleDto.renavam,
      createVehicleDto.year,
      createVehicleDto.model_id,
      userId
    );

    await this.vehicleRepository.create(vehicle);
    await this.invalidateCache();
    await this.auditService.log("CREATE", "VEHICLE", vehicle.id, userId, createVehicleDto);
  }

  async findAll(): Promise<Vehicle[]> {
    const cached = await this.cacheManager.get<Vehicle[]>(this.CACHE_KEY_ALL);
    if (cached) return cached;

    const vehicles = await this.vehicleRepository.findAll();
    await this.cacheManager.set(this.CACHE_KEY_ALL, vehicles);
    return vehicles;
  }

  async findOne(id: string): Promise<Vehicle> {
    const cacheKey = `vehicle_${id}`;
    const cached = await this.cacheManager.get<Vehicle>(cacheKey);
    if (cached) return cached;

    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) throw new NotFoundException("Vehicle not found");

    await this.cacheManager.set(cacheKey, vehicle);
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<void> {
    const vehicle = await this.findOne(id);

    if (updateVehicleDto.model_id) {
      const model = await this.modelRepository.findById(updateVehicleDto.model_id);
      if (!model) throw new NotFoundException("Model not found");
    }

    const updatedVehicle = Vehicle.restore(
      vehicle.id,
      updateVehicleDto.license_plate ?? vehicle.license_plate,
      updateVehicleDto.chassis ?? vehicle.chassis,
      updateVehicleDto.renavam ?? vehicle.renavam,
      updateVehicleDto.year ?? vehicle.year,
      updateVehicleDto.model_id ?? vehicle.model_id,
      vehicle.created_by_id,
      vehicle.created_at,
      new Date()
    );

    await this.vehicleRepository.update(updatedVehicle);
    await this.invalidateCache(id);
    await this.auditService.log("UPDATE", "VEHICLE", id, vehicle.created_by_id, updateVehicleDto);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.delete(id);
    await this.invalidateCache(id);
    await this.auditService.log("DELETE", "VEHICLE", id, vehicle.created_by_id);
  }

  private async invalidateCache(id?: string) {
    await this.cacheManager.del(this.CACHE_KEY_ALL);
    if (id) {
      await this.cacheManager.del(`vehicle_${id}`);
    }
  }
}
