import { Model } from "./model";

export abstract class ModelRepository {
  abstract findById(id: string): Promise<Model | null>;
  abstract findAll(): Promise<Model[]>;
  abstract create(model: Model): Promise<void>;
  abstract update(model: Model): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
