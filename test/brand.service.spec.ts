import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from '../src/brand/brand.service';
import { BrandRepository } from '../src/brand/brand.repository';
import { Brand } from '../src/brand/brand';
import { NotFoundException } from '@nestjs/common';
import { AuditService } from '../src/audit/audit.service';

describe('BrandService', () => {
  let service: BrandService;
  let repository: BrandRepository;
  let auditService: AuditService;

  const mockBrandRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: BrandRepository,
          useValue: mockBrandRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    repository = module.get<BrandRepository>(BrandRepository);
    auditService = module.get<AuditService>(AuditService);
  });

  describe('create', () => {
    it('should create a brand', async () => {
      const dto = { name: 'Toyota' };
      const userId = 'user-123';
      await service.create(dto, userId);
      expect(repository.create).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalledWith('CREATE', 'BRAND', expect.any(String), userId, dto);
    });
  });

  describe('findAll', () => {
    it('should return all brands', async () => {
      const brands = [Brand.restore('1', 'Toyota', 'user-1')];
      mockBrandRepository.findAll.mockResolvedValue(brands);
      expect(await service.findAll()).toEqual(brands);
    });
  });

  describe('findOne', () => {
    it('should return a brand if found', async () => {
      const brand = Brand.restore('1', 'Toyota', 'user-123');
      mockBrandRepository.findById.mockResolvedValue(brand);
      expect(await service.findOne('1')).toEqual(brand);
    });

    it('should throw NotFoundException if not found', async () => {
      mockBrandRepository.findById.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a brand', async () => {
      const brand = Brand.restore('1', 'Toyota', 'user-1');
      const dto = { name: 'Toyota Updated' };
      mockBrandRepository.findById.mockResolvedValue(brand);

      await service.update('1', dto);

      expect(repository.update).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalledWith('UPDATE', 'BRAND', '1', 'user-1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a brand', async () => {
      const brand = Brand.restore('1', 'Toyota', 'user-1');
      mockBrandRepository.findById.mockResolvedValue(brand);

      await service.remove('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(auditService.log).toHaveBeenCalledWith('DELETE', 'BRAND', '1', 'user-1');
    });
  });
});
