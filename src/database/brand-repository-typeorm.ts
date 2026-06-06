import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BrandEntity } from "../database/brand.entity";
import { Brand } from "../brand/brand";
import { BrandRepository } from "../brand/brand.repository";

@Injectable()
export class BrandRepositoryTypeorm implements BrandRepository {
  private readonly repository: Repository<BrandEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(BrandEntity);
  }

  async findById(id: string): Promise<Brand | null> {
    const brandInDb = await this.repository.findOne({ where: { id } });
    if (!brandInDb) return null;
    return Brand.restore(
      brandInDb.id,
      brandInDb.name,
      brandInDb.created_by_id,
      brandInDb.created_at,
      brandInDb.updated_at
    );
  }

  async findAll(): Promise<Brand[]> {
    const brands = await this.repository.find();
    return brands.map((b) =>
      Brand.restore(b.id, b.name, b.created_by_id, b.created_at, b.updated_at)
    );
  }

  async create(brand: Brand): Promise<void> {
    const brandToBeCreated = this.repository.create({
      id: brand.id,
      name: brand.name,
      created_by_id: brand.created_by_id,
    });
    await this.repository.save(brandToBeCreated);
  }

  async update(brand: Brand): Promise<void> {
    await this.repository.save({
      id: brand.id,
      name: brand.name,
      created_by_id: brand.created_by_id,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
