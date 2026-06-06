import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ModelEntity } from "../database/model.entity";
import { Model } from "../model/model";
import { ModelRepository } from "../model/model.repository";

@Injectable()
export class ModelRepositoryTypeorm implements ModelRepository {
  private readonly repository: Repository<ModelEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ModelEntity);
  }

  async findById(id: string): Promise<Model | null> {
    const modelInDb = await this.repository.findOne({ where: { id } });
    if (!modelInDb) return null;
    return Model.restore(
      modelInDb.id,
      modelInDb.name,
      modelInDb.brand_id,
      modelInDb.created_by_id,
      modelInDb.created_at,
      modelInDb.updated_at
    );
  }

  async findAll(): Promise<Model[]> {
    const models = await this.repository.find();
    return models.map((m) =>
      Model.restore(
        m.id,
        m.name,
        m.brand_id,
        m.created_by_id,
        m.created_at,
        m.updated_at
      )
    );
  }

  async create(model: Model): Promise<void> {
    const modelToBeCreated = this.repository.create({
      id: model.id,
      name: model.name,
      brand_id: model.brand_id,
      created_by_id: model.created_by_id,
    });
    await this.repository.save(modelToBeCreated);
  }

  async update(model: Model): Promise<void> {
    await this.repository.save({
      id: model.id,
      name: model.name,
      brand_id: model.brand_id,
      created_by_id: model.created_by_id,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
