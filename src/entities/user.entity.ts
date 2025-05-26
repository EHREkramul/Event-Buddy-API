import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Unique,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { Event } from './event.entity';
import { Booking } from './booking.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'varchar', length: 300, nullable: true })
  refreshToken?: string; // Store the hashed refreshToken

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  //--------------------------- Relations ---------------------------
  @OneToMany(() => Event, (event) => event.createdBy)
  events: Event[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  //--------------------------- HOOKS ---------------------------

  @BeforeInsert()
  normalizeEmail() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert() // Initcap the name of user
  normalizeFullName() {
    if (this.fullName) {
      this.fullName = this.fullName
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
    }
  }

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
