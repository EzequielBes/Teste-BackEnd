import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from '../src/vehicle/vehicle.service';
import { VehicleRepository } from '../src/vehicle/vehicle.repository';
import { ModelRepository } from '../src/model/model.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Vehicle } from '../src/vehicle/vehicle';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AuditService } from '../src/audit/audit.service';

describe('VehicleService', () => {
  let service: VehicleService;
  let vehicleRepository: VehicleRepository;
  let modelRepository: ModelRepository;
  let cacheManager: any;
  let auditService: AuditService;

  const mockVehicleRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByLicensePlate: jest.fn(),
  };

  const mockModelRepository = {
    findById: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        { provide: VehicleRepository, useValue: mockVehicleRepository },
        { provide: ModelRepository, useValue: mockModelRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehicleRepository = module.get<VehicleRepository>(VehicleRepository);
    modelRepository = module.get<ModelRepository>(ModelRepository);
    cacheManager = module.get(CACHE_MANAGER);
    auditService = module.get<AuditService>(AuditService);
  });

  describe('create', () => {
    it('should create a vehicle and invalidate cache', async () => {
      const dto = {
        license_plate: 'ABC-1234',
        chassis: 'CH1',
        renavam: 'REN1',
        year: 2022,
        model_id: 'mod1',
      };
      mockModelRepository.findById.mockResolvedValue({ id: 'mod1' });
      mockVehicleRepository.findByLicensePlate.mockResolvedValue(null);

      await service.create(dto, 'user1');

      expect(vehicleRepository.create).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalledWith('vehicles_all');
      expect(auditService.log).toHaveBeenCalledWith('CREATE', 'VEHICLE', expect.any(String), 'user1', dto);
    });

    it('should throw ConflictException if license plate exists', async () => {
      const dto = { license_plate: 'ABC-1234', model_id: 'mod1' } as any;
      mockModelRepository.findById.mockResolvedValue({ id: 'mod1' });
      mockVehicleRepository.findByLicensePlate.mockResolvedValue({ id: 'existing' });

      await expect(service.create(dto, 'user1')).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return cached vehicles if available', async () => {
      const vehicles = [Vehicle.restore('1', 'ABC-1234', 'CH1', 'REN1', 2022, 'mod1', 'user1')];
      mockCacheManager.get.mockResolvedValue(vehicles);

      const result = await service.findAll();
      expect(result).toEqual(vehicles);
    });

    it('should fetch from repository and cache if not in cache', async () => {
      const vehicles = [Vehicle.restore('1', 'ABC-1234', 'CH1', 'REN1', 2022, 'mod1', 'user1')];
      mockCacheManager.get.mockResolvedValue(null);
      mockVehicleRepository.findAll.mockResolvedValue(vehicles);

      const result = await service.findAll();
      expect(result).toEqual(vehicles);
      expect(mockCacheManager.set).toHaveBeenCalledWith('vehicles_all', vehicles);
    });
  });

  describe('findOne', () => {
    it('should return cached vehicle if available', async () => {
      const vehicle = Vehicle.restore('1', 'ABC-1234', 'CH1', 'REN1', 2022, 'mod1', 'user1');
      mockCacheManager.get.mockResolvedValue(vehicle);

      const result = await service.findOne('1');
      expect(result).toEqual(vehicle);
      expect(mockCacheManager.get).toHaveBeenCalledWith('vehicle_1');
    });

    it('should fetch from repo and cache if not in cache', async () => {
      const vehicle = Vehicle.restore('1', 'ABC-1234', 'CH1', 'REN1', 2022, 'mod1', 'user1');
      mockCacheManager.get.mockResolvedValue(null);
      mockVehicleRepository.findById.mockResolvedValue(vehicle);

      const result = await service.findOne('1');
      expect(result).toEqual(vehicle);
      expect(mockCacheManager.set).toHaveBeenCalledWith('vehicle_1', vehicle);
    });
  });

  describe('update', () => {
    it('should update vehicle and invalidate cache', async () => {
      const vehicle = Vehicle.restore('1', 'ABC-1234', 'CH1', 'REN1', 2022, 'mod1', 'user1');
      const dto = { license_plate: 'UPDATED' };
      mockCacheManager.get.mockResolvedValue(vehicle);
      mockVehicleRepository.findById.mockResolvedValue(vehicle);

      await service.update('1', dto);

      expect(vehicleRepository.update).toHaveBeenCalled();
      expect(mockCacheManager.del).toHaveBeenCalledWith('vehicles_all');
      expect(mockCacheManager.del).toHaveBeenCalledWith('vehicle_1');
      expect(auditService.log).toHaveBeenCalledWith('UPDATE', 'VEHICLE', '1', 'user1', dto);
    });
  });

  describe('remove', () => {
    it('should remove vehicle and invalidate cache', async () => {
      const vehicle = Vehicle.restore('1', 'ABC-1234', 'CH1', 'REN1', 2022, 'mod1', 'user1');
      mockVehicleRepository.findById.mockResolvedValue(vehicle);

      await service.remove('1');

      expect(vehicleRepository.delete).toHaveBeenCalledWith('1');
      expect(mockCacheManager.del).toHaveBeenCalledWith('vehicles_all');
      expect(mockCacheManager.del).toHaveBeenCalledWith('vehicle_1');
      expect(auditService.log).toHaveBeenCalledWith('DELETE', 'VEHICLE', '1', 'user1');
    });
  });
});
