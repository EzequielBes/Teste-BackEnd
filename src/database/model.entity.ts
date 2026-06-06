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
import { BrandEntity } from './brand.entity';

@Entity('model')
export class ModelEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => BrandEntity)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @Column()
  brand_id: string;

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
