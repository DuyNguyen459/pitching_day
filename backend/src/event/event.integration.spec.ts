import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { TokenService } from '../auth/token.service';
import { EventEntity } from '../entities/event.entity';
import { NotFoundException } from '@nestjs/common';

describe('Event Auth API - Integration Flow', () => {
  const tokenService = new TokenService();
  const mockEvent: EventEntity = {
    eventId: 'e49b80bc-65f0-4dfb-90f7-111111111111',
    eventName: 'Integration Test Pitching Day',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600 * 1000),
    accessCode: 'INT123',
    createdAt: new Date(),
    projects: [],
    questions: [],
  };

  const mockRepository = {
    findByAccessCode: async (code: string) => {
      if (code === 'INT123') return mockEvent;
      return null;
    },
    findById: async (id: string) => {
      if (id === mockEvent.eventId) return mockEvent;
      return null;
    },
  } as unknown as EventRepository;

  const eventService = new EventService(mockRepository, tokenService);
  const controller = new EventController(eventService);

  it('should successfully authenticate, issue, and verify token end to end', async () => {
    // 1. Call controller endpoint mimicking HTTP request param parsing
    const response = await controller.authenticate('INT123', 'device-foo', undefined);
    assert.ok(response.token, 'Token should be returned');
    assert.strictEqual(response.participantId, 'device-foo', 'Participant ID must match device fingerprint');
    assert.strictEqual(response.event.eventId, mockEvent.eventId, 'Response event ID must match');
    assert.strictEqual(response.event.eventName, mockEvent.eventName, 'Response event name must match');

    // 2. Verify that the issued token is fully verified by the TokenService
    const decoded = tokenService.verify(response.token);
    assert.ok(decoded, 'Issued token must be valid and verifiable');
    assert.strictEqual(decoded.eventId, mockEvent.eventId, 'Token payload eventId must match');
    assert.strictEqual(decoded.participantId, 'device-foo', 'Token payload participantId must match');
    assert.strictEqual(decoded.role, 'user', 'Token payload role must be user');
  });

  it('should fail to authenticate and throw NotFoundException for invalid access code', async () => {
    try {
      await controller.authenticate('BAD_CODE', undefined, undefined);
      assert.fail('Should have thrown NotFoundException');
    } catch (err) {
      assert.ok(err instanceof NotFoundException, 'Thrown error must be a NotFoundException');
      assert.strictEqual(err.message, 'Event not found with the provided access code.');
    }
  });
});
