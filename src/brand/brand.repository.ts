import { Brand } from "./brand";

export abstract class BrandRepository {
  abstract findById(id: string): Promise<Brand | null>;
  abstract findAll(): Promise<Brand[]>;
  abstract create(brand: Brand): Promise<void>;
  abstract update(brand: Brand): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
