import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import Redis from 'ioredis';

@Controller('api/v1/health')
export class HealthController {
  private pgPool: Pool;
  private redisClient: Redis;

  constructor() {
    this.pgPool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/pitching_day',
    });

    this.redisClient = new Redis(
      process.env.REDIS_URL || 'redis://localhost:6379',
    );
  }

  @Get()
  async checkHealth() {
    let dbStatus = 'OFFLINE';
    let redisStatus = 'OFFLINE';

    try {
      const client = await this.pgPool.connect();
      await client.query('SELECT 1');
      client.release();
      dbStatus = 'ONLINE';
    } catch (err) {
      console.error('PostgreSQL health check failed:', err);
    }

    try {
      const pong = await this.redisClient.ping();
      if (pong === 'PONG') {
        redisStatus = 'ONLINE';
      }
    } catch (err) {
      console.error('Redis health check failed:', err);
    }

    if (dbStatus === 'OFFLINE' || redisStatus === 'OFFLINE') {
      throw new InternalServerErrorException(
        `Service degraded: Database is ${dbStatus}, Redis cache is ${redisStatus}`,
      );
    }

    return {
      status: 'OK',
      database: dbStatus,
      redis: redisStatus,
    };
  }

  @Get('trigger-error')
  triggerError() {
    throw new InternalServerErrorException(
      'This is a test of the standard error formatting system.',
    );
  }
}
