import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Event } from 'src/entities/event.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserBookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async bookEvent(userId: number, eventId: number, seatsBooked: number) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    // Validate the event exists
    if (!event) {
      throw new NotFoundException(
        'Event not found. Please provide a valid event ID.',
      );
    }

    // Check if the event is already running or has ended
    const currentDate = new Date();
    if (
      event.eventStartDate < currentDate ||
      event.eventEndDate < currentDate
    ) {
      throw new BadRequestException(
        'Cannot book seats for an event that has already started or ended.',
      );
    }

    // Validate the number of seats booked
    const existingBookings = await this.bookingsRepository.find({
      where: { event: { id: eventId } },
    });
    const totalBookedSeats = existingBookings.reduce(
      (sum, booking) => sum + booking.seatsBooked,
      0,
    );

    if (totalBookedSeats + seatsBooked > event.totalCapacity) {
      throw new BadRequestException('Not enough seats available.');
    }

    // Check if the user has already booked for this event
    const userAlreadyBooked = await this.bookingsRepository.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });

    if (userAlreadyBooked) {
      throw new ConflictException(
        'You have already booked seats for this event. Only one booking per user per event is allowed. Update your booking instead(If available).',
      );
    }

    // Validate the user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const booking = this.bookingsRepository.create({
      user,
      event,
      seatsBooked,
    });

    return this.bookingsRepository.save(booking);
  }

  async findUserBookings(userId: number) {
    // Validate the user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Fetch bookings for the user
    const bookings = await this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['event'],
    });

    // If no bookings found, return an empty array
    if (bookings.length === 0) {
      throw new NotFoundException('No bookings found for this user.');
    }

    return bookings;
  }

  async cancelBooking(bookingId: number, userId: number): Promise<void> {
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    if (booking.user.id !== userId) {
      throw new NotFoundException(
        `You are not authorized to cancel this booking`,
      );
    }

    await this.bookingsRepository.remove(booking);
  }
}
