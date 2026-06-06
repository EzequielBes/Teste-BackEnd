import { Module } from "@nestjs/common";
import { ModelController } from "./model-controller";
import { ModelService } from "./model.service";
import { ModelRepository } from "./model.repository";
import { ModelRepositoryTypeorm } from "../database/model-repository-typeorm";
import { DatabaseModule } from "../database/database.module";
import { BrandModule } from "../brand/brand.module";

@Module({
  imports: [DatabaseModule, BrandModule],
  controllers: [ModelController],
  providers: [
    ModelService,
    {
      provide: ModelRepository,
      useClass: ModelRepositoryTypeorm,
    },
  ],
  exports: [ModelService, ModelRepository],
})
export class ModelModule {}
