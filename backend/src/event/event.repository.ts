import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../entities/event.entity';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>,
  ) {}

  /**
   * Find an event by its unique access code.
   * @param accessCode Access code from URL or QR
   * @returns Event entity if found, otherwise null
   */
  async findByAccessCode(accessCode: string): Promise<EventEntity | null> {
    return this.repository.findOne({ where: { accessCode } });
  }

  /**
   * Find an event by its primary key ID.
   * @param eventId Event UUID
   * @returns Event entity if found, otherwise null
   */
  async findById(eventId: string): Promise<EventEntity | null> {
    return this.repository.findOne({ where: { eventId } });
  }
}
