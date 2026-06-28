import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { CreateInitialTables1719223847291 } from './migrations/create-initial-tables';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/pitching_day',
      autoLoadEntities: true,
      synchronize: false, // Use migrations for schema sync
      migrationsRun: true, // Auto-run migrations on startup
      migrations: [CreateInitialTables1719223847291],
    }),
    EventModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
