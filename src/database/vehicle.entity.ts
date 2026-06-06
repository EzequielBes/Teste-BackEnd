import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { ModelEntity } from './model.entity';

@Entity('vehicle')
export class VehicleEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  license_plate: string;

  @Column({ unique: true })
  chassis: string;

  @Column({ unique: true })
  renavam: string;

  @Column()
  year: number;

  @ManyToOne(() => ModelEntity)
  @JoinColumn({ name: 'model_id' })
  model: ModelEntity;

  @Column()
  model_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'created_by' })
  created_by: AccountEntity;

  @Column()
  created_by_id: string;
}
