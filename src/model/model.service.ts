import { Injectable, NotFoundException } from "@nestjs/common";
import { ModelRepository } from "./model.repository";
import { Model } from "./model";
import { CreateModelDto } from "./dto/create-model.dto";
import { UpdateModelDto } from "./dto/update-model.dto";
import { BrandRepository } from "../brand/brand.repository";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class ModelService {
  constructor(
    private readonly modelRepository: ModelRepository,
    private readonly brandRepository: BrandRepository,
    private readonly auditService: AuditService
  ) {}

  async create(createModelDto: CreateModelDto, userId: string): Promise<void> {
    const brand = await this.brandRepository.findById(createModelDto.brand_id);
    if (!brand) throw new NotFoundException("Brand not found");

    const model = Model.create(createModelDto.name, createModelDto.brand_id, userId);
    await this.modelRepository.create(model);
    await this.auditService.log("CREATE", "MODEL", model.id, userId, createModelDto);
  }

  async findAll(): Promise<Model[]> {
    return await this.modelRepository.findAll();
  }

  async findOne(id: string): Promise<Model> {
    const model = await this.modelRepository.findById(id);
    if (!model) throw new NotFoundException("Model not found");
    return model;
  }

  async update(id: string, updateModelDto: UpdateModelDto): Promise<void> {
    const model = await this.findOne(id);
    
    if (updateModelDto.brand_id) {
      const brand = await this.brandRepository.findById(updateModelDto.brand_id);
      if (!brand) throw new NotFoundException("Brand not found");
    }

    const updatedModel = Model.restore(
      model.id,
      updateModelDto.name ?? model.name,
      updateModelDto.brand_id ?? model.brand_id,
      model.created_by_id,
      model.created_at,
      new Date()
    );
    await this.modelRepository.update(updatedModel);
    await this.auditService.log("UPDATE", "MODEL", id, model.created_by_id, updateModelDto);
  }

  async remove(id: string): Promise<void> {
    const model = await this.findOne(id);
    await this.modelRepository.delete(id);
    await this.auditService.log("DELETE", "MODEL", id, model.created_by_id);
  }
}
