import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity({ name: 'bookings' })
@Unique(['user', 'event']) // One booking per user per event
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  seatsBooked: number;

  @CreateDateColumn()
  bookedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //--------------------------- Relations ---------------------------
  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
