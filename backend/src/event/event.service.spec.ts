import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { TokenService } from '../auth/token.service';
import { NotFoundException } from '@nestjs/common';
import { EventEntity } from '../entities/event.entity';

describe('EventService', () => {
  const tokenService = new TokenService();
  const mockEvent: EventEntity = {
    eventId: 'e49b80bc-65f0-4dfb-90f7-111111111111',
    eventName: 'Demo Event',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600 * 1000),
    accessCode: 'DEMO123',
    createdAt: new Date(),
    projects: [],
    questions: [],
  };

  const mockRepository = {
    findByAccessCode: async (code: string) => {
      if (code === 'DEMO123') return mockEvent;
      return null;
    },
    findById: async (id: string) => {
      if (id === mockEvent.eventId) return mockEvent;
      return null;
    },
  } as unknown as EventRepository;

  const eventService = new EventService(mockRepository, tokenService);

  it('should authenticate correctly with a valid access code', async () => {
    const result = await eventService.authenticateEvent('DEMO123');
    assert.ok(result.token, 'Token should be issued');
    assert.ok(result.participantId, 'Participant ID should be generated');
    assert.strictEqual(result.event.eventId, mockEvent.eventId, 'Event IDs must match');
    assert.strictEqual(result.event.eventName, mockEvent.eventName, 'Event names must match');

    // Verify token contents
    const verified = tokenService.verify(result.token);
    assert.ok(verified, 'Issued token must be valid');
    assert.strictEqual(verified.eventId, mockEvent.eventId);
    assert.strictEqual(verified.participantId, result.participantId);
    assert.strictEqual(verified.role, 'user');
  });

  it('should use the provided device_id as participantId if provided', async () => {
    const customDeviceId = 'my-custom-device-fingerprint';
    const result = await eventService.authenticateEvent('DEMO123', customDeviceId);
    assert.strictEqual(result.participantId, customDeviceId, 'Participant ID must match custom device fingerprint');

    const verified = tokenService.verify(result.token);
    assert.strictEqual(verified.participantId, customDeviceId, 'Token payload must embed custom device ID');
  });

  it('should throw NotFoundException when an invalid access code is given', async () => {
    try {
      await eventService.authenticateEvent('INVALID');
      assert.fail('Should have thrown NotFoundException');
    } catch (err) {
      assert.ok(err instanceof NotFoundException, 'Thrown error must be a NotFoundException');
      assert.strictEqual(err.message, 'Event not found with the provided access code.');
    }
  });
});
