import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('EventController', () => {
  let lastAccessCode = '';
  let lastDeviceId = '';

  const mockEventService = {
    authenticateEvent: async (accessCode: string, deviceId?: string) => {
      lastAccessCode = accessCode;
      lastDeviceId = deviceId || '';
      return { success: true };
    },
  } as unknown as EventService;

  const controller = new EventController(mockEventService);

  it('should map access code and snake_case device_id correctly to the service', async () => {
    lastAccessCode = '';
    lastDeviceId = '';
    await controller.authenticate('DEMO123', 'snake-device-id', undefined);
    assert.strictEqual(lastAccessCode, 'DEMO123');
    assert.strictEqual(lastDeviceId, 'snake-device-id');
  });

  it('should map access code and camelCase deviceId correctly to the service', async () => {
    lastAccessCode = '';
    lastDeviceId = '';
    await controller.authenticate('DEMO123', undefined, 'camel-device-id');
    assert.strictEqual(lastAccessCode, 'DEMO123');
    assert.strictEqual(lastDeviceId, 'camel-device-id');
  });

  it('should prioritize snake_case device_id if both query styles are passed', async () => {
    lastAccessCode = '';
    lastDeviceId = '';
    await controller.authenticate('DEMO123', 'snake-device-id', 'camel-device-id');
    assert.strictEqual(lastAccessCode, 'DEMO123');
    assert.strictEqual(lastDeviceId, 'snake-device-id');
  });
});
