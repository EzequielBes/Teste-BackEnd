import { Injectable, NotFoundException } from "@nestjs/common";
import { BrandRepository } from "./brand.repository";
import { Brand } from "./brand";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly auditService: AuditService
  ) {}

  async create(createBrandDto: CreateBrandDto, userId: string): Promise<void> {
    const brand = Brand.create(createBrandDto.name, userId);
    await this.brandRepository.create(brand);
    await this.auditService.log("CREATE", "BRAND", brand.id, userId, createBrandDto);
  }

  async findAll(): Promise<Brand[]> {
    return await this.brandRepository.findAll();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) throw new NotFoundException("Brand not found");
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<void> {
    const brand = await this.findOne(id);
    const updatedBrand = Brand.restore(
      brand.id,
      updateBrandDto.name ?? brand.name,
      brand.created_by_id,
      brand.created_at,
      new Date()
    );
    await this.brandRepository.update(updatedBrand);
    await this.auditService.log("UPDATE", "BRAND", id, brand.created_by_id, updateBrandDto);
  }

  async remove(id: string): Promise<void> {
    const brand = await this.findOne(id);
    await this.brandRepository.delete(id);
    await this.auditService.log("DELETE", "BRAND", id, brand.created_by_id);
  }
}
