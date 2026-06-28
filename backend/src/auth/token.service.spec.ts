import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { TokenService } from './token.service';

describe('TokenService', () => {
  const tokenService = new TokenService();
  const payload = { userId: '12345', role: 'admin' };

  it('should sign a token and return a 3-part JWT-like string', () => {
    const token = tokenService.sign(payload);
    assert.ok(token, 'Token must not be empty');
    assert.strictEqual(token.split('.').length, 3, 'Token must contain header, payload, and signature parts');
  });

  it('should verify a valid token and return the original payload', () => {
    const token = tokenService.sign(payload);
    const decoded = tokenService.verify(token);
    assert.ok(decoded, 'Decoded token should not be null');
    assert.strictEqual(decoded.userId, payload.userId);
    assert.strictEqual(decoded.role, payload.role);
    assert.ok(decoded.exp, 'Decoded token must contain expiration field');
  });

  it('should return null if the token signature is tampered with', () => {
    const token = tokenService.sign(payload);
    const tamperedToken = token + 'tampered';
    const decoded = tokenService.verify(tamperedToken);
    assert.strictEqual(decoded, null, 'Tampered token verification must return null');
  });

  it('should return null if the token is expired', () => {
    // Expires 10 seconds in the past
    const expiredToken = tokenService.sign(payload, -10);
    const decoded = tokenService.verify(expiredToken);
    assert.strictEqual(decoded, null, 'Expired token verification must return null');
  });
});
