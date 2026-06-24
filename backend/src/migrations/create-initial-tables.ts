import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1719223847291 implements MigrationInterface {
  name = 'CreateInitialTables1719223847291';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create events table
    await queryRunner.query(`
      CREATE TABLE "events" (
        "event_id" UUID PRIMARY KEY,
        "event_name" VARCHAR(255) NOT NULL,
        "start_time" TIMESTAMP NOT NULL,
        "end_time" TIMESTAMP NOT NULL,
        "access_code" VARCHAR(50) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "project_id" UUID PRIMARY KEY,
        "event_id" UUID NOT NULL,
        "project_name" VARCHAR(255) NOT NULL,
        "status" VARCHAR(20) NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_projects_event" FOREIGN KEY ("event_id") REFERENCES "events" ("event_id") ON DELETE CASCADE
      )
    `);

    // Create questions table
    await queryRunner.query(`
      CREATE TABLE "questions" (
        "question_id" UUID PRIMARY KEY,
        "event_id" UUID NOT NULL,
        "project_id" UUID,
        "content" TEXT NOT NULL,
        "answer" TEXT,
        "status" VARCHAR(20) NOT NULL,
        "is_anonymous" BOOLEAN NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_questions_event" FOREIGN KEY ("event_id") REFERENCES "events" ("event_id") ON DELETE CASCADE,
        CONSTRAINT "fk_questions_project" FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id") ON DELETE SET NULL
      )
    `);

    // Create votes table
    await queryRunner.query(`
      CREATE TABLE "votes" (
        "vote_id" UUID PRIMARY KEY,
        "project_id" UUID NOT NULL,
        "participant_id" VARCHAR(255) NOT NULL,
        "voted_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_votes_project" FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id") ON DELETE CASCADE
      )
    `);

    // Create performance indexes
    await queryRunner.query(`CREATE INDEX "idx_projects_event_id" ON "projects" ("event_id")`);
    await queryRunner.query(`CREATE INDEX "idx_questions_event_id" ON "questions" ("event_id")`);
    await queryRunner.query(`CREATE INDEX "idx_questions_project_id" ON "questions" ("project_id")`);
    await queryRunner.query(`CREATE INDEX "idx_votes_project_id" ON "votes" ("project_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_votes_project_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_questions_project_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_questions_event_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_projects_event_id"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "votes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "questions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "events"`);
  }
}
