import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('api/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Endpoint for participant authentication/session establishment.
   * Path: GET /api/events/:code/auth
   * Query options: device_id (snake_case) or deviceId (camelCase)
   */
  @Get(':code/auth')
  async authenticate(
    @Param('code') code: string,
    @Query('device_id') deviceIdSnake?: string,
    @Query('deviceId') deviceIdCamel?: string,
  ) {
    const deviceId = deviceIdSnake || deviceIdCamel;
    return this.eventService.authenticateEvent(code, deviceId);
  }
}
