import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { TokenService } from '../auth/token.service';
import * as crypto from 'crypto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Validates an access code, establishes a participant session, and issues a token.
   * @param accessCode The code from QR or URL access
   * @param deviceId Optional identifier for the user's device (fingerprint)
   * @returns An object containing the session token, participant ID, and event metadata
   */
  async authenticateEvent(accessCode: string, deviceId?: string) {
    const event = await this.eventRepository.findByAccessCode(accessCode);

    if (!event) {
      throw new NotFoundException('Event not found with the provided access code.');
    }

    // Device Identification Logic:
    // If deviceId is provided, use it as participantId. Otherwise, generate a new UUID.
    const participantId = deviceId || crypto.randomUUID();

    // Issue a temporary session token containing event context and participant context
    const tokenPayload = {
      eventId: event.eventId,
      participantId,
      role: 'user', // Participants are 'user' level
    };

    // Session token expires in 24 hours (86400 seconds)
    const token = this.tokenService.sign(tokenPayload);

    return {
      token,
      participantId,
      event: {
        eventId: event.eventId,
        eventName: event.eventName,
        startTime: event.startTime,
        endTime: event.endTime,
        accessCode: event.accessCode,
      },
    };
  }
}
