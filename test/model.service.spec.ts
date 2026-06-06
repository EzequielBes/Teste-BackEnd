import { Test, TestingModule } from '@nestjs/testing';
import { ModelService } from '../src/model/model.service';
import { ModelRepository } from '../src/model/model.repository';
import { BrandRepository } from '../src/brand/brand.repository';
import { AuditService } from '../src/audit/audit.service';
import { Model } from '../src/model/model';
import { Brand } from '../src/brand/brand';
import { NotFoundException } from '@nestjs/common';

describe('ModelService', () => {
  let service: ModelService;
  let modelRepository: ModelRepository;
  let brandRepository: BrandRepository;
  let auditService: AuditService;

  const mockModelRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockBrandRepository = {
    findById: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        { provide: ModelRepository, useValue: mockModelRepository },
        { provide: BrandRepository, useValue: mockBrandRepository },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<ModelService>(ModelService);
    modelRepository = module.get<ModelRepository>(ModelRepository);
    brandRepository = module.get<BrandRepository>(BrandRepository);
    auditService = module.get<AuditService>(AuditService);
  });

  describe('create', () => {
    it('should create a model if brand exists', async () => {
      const dto = { name: 'Corolla', brand_id: 'brand-1' };
      const brand = Brand.restore('brand-1', 'Toyota', 'user-1');
      mockBrandRepository.findById.mockResolvedValue(brand);

      await service.create(dto, 'user-1');

      expect(modelRepository.create).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalledWith('CREATE', 'MODEL', expect.any(String), 'user-1', dto);
    });

    it('should throw NotFoundException if brand does not exist', async () => {
      const dto = { name: 'Corolla', brand_id: 'invalid' };
      mockBrandRepository.findById.mockResolvedValue(null);

      await expect(service.create(dto, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a model if found', async () => {
      const model = Model.restore('1', 'Corolla', 'brand-1', 'user-1');
      mockModelRepository.findById.mockResolvedValue(model);

      const result = await service.findOne('1');
      expect(result).toEqual(model);
    });

    it('should throw NotFoundException if not found', async () => {
      mockModelRepository.findById.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a model', async () => {
      const model = Model.restore('1', 'Corolla', 'brand-1', 'user-1');
      const dto = { name: 'Corolla Updated' };
      mockModelRepository.findById.mockResolvedValue(model);

      await service.update('1', dto);

      expect(modelRepository.update).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalledWith('UPDATE', 'MODEL', '1', 'user-1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a model', async () => {
      const model = Model.restore('1', 'Corolla', 'brand-1', 'user-1');
      mockModelRepository.findById.mockResolvedValue(model);

      await service.remove('1');

      expect(modelRepository.delete).toHaveBeenCalledWith('1');
      expect(auditService.log).toHaveBeenCalledWith('DELETE', 'MODEL', '1', 'user-1');
    });
  });
});
