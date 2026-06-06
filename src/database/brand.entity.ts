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

@Entity('brand')
export class BrandEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

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
