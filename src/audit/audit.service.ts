import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
  ) {}

  async log(
    action: string,
    entity: string,
    entityId: string,
    userId: string,
    payload?: any,
  ): Promise<void> {
    const log = new this.auditLogModel({
      action,
      entity,
      entityId,
      userId,
      payload,
    });
    await log.save();
  }
}
