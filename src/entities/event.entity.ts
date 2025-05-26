import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  eventStartDate: Date;

  @Column({ type: 'timestamp' })
  eventEndDate: Date;

  @Column({ type: 'int' })
  totalCapacity: number;

  @Column({ type: 'varchar', length: 255 })
  eventLocation: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  eventTags: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnailImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //--------------------------- Relations ---------------------------
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
