import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  private readonly secret = process.env.JWT_SECRET || 'pitching-day-secret-key-123456';

  /**
   * Signs a stateless token containing the payload.
   * @param payload Data to encode in the token
   * @param expiresInSeconds Expiration duration in seconds (default is 24 hours)
   * @returns Base64 URL-encoded JWT-like token string
   */
  sign(payload: Record<string, any>, expiresInSeconds = 86400): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const fullPayload = { ...payload, exp };

    const base64Header = this.base64UrlEncode(JSON.stringify(header));
    const base64Payload = this.base64UrlEncode(JSON.stringify(fullPayload));

    const signature = this.createSignature(`${base64Header}.${base64Payload}`);
    return `${base64Header}.${base64Payload}.${signature}`;
  }

  /**
   * Verifies the token structure, signature, and expiration.
   * @param token Token string to verify
   * @returns Decoded payload if valid, otherwise null
   */
  verify(token: string): Record<string, any> | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;
    const expectedSignature = this.createSignature(`${header}.${payload}`);

    if (signature !== expectedSignature) {
      return null;
    }

    try {
      const decodedPayload = JSON.parse(this.base64UrlDecode(payload));
      if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        return null; // Token has expired
      }
      return decodedPayload;
    } catch {
      return null;
    }
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return Buffer.from(str, 'base64').toString('utf8');
  }

  private createSignature(data: string): string {
    return crypto
      .createHmac('sha256', this.secret)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
