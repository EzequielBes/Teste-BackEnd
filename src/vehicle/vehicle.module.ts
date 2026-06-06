import { Module } from "@nestjs/common";
import { VehicleController } from "./vehicle-controller";
import { VehicleService } from "./vehicle.service";
import { VehicleRepository } from "./vehicle.repository";
import { VehicleRepositoryTypeorm } from "../database/vehicle-repository-typeorm";
import { DatabaseModule } from "../database/database.module";
import { ModelModule } from "../model/model.module";

@Module({
  imports: [DatabaseModule, ModelModule],
  controllers: [VehicleController],
  providers: [
    VehicleService,
    {
      provide: VehicleRepository,
      useClass: VehicleRepositoryTypeorm,
    },
  ],
  exports: [VehicleService, VehicleRepository],
})
export class VehicleModule {}
