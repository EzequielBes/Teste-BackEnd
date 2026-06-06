import { Module } from "@nestjs/common";
import { BrandController } from "./brand-controller";
import { BrandService } from "./brand.service";
import { BrandRepository } from "./brand.repository";
import { BrandRepositoryTypeorm } from "../database/brand-repository-typeorm";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [BrandController],
  providers: [
    BrandService,
    {
      provide: BrandRepository,
      useClass: BrandRepositoryTypeorm,
    },
  ],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
