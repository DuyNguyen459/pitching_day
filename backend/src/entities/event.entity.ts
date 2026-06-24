import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { QuestionEntity } from './question.entity';

@Entity({ name: 'events' })
export class EventEntity {
  @PrimaryColumn({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'event_name', type: 'varchar', length: 255 })
  eventName: string;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({ name: 'access_code', type: 'varchar', length: 50 })
  accessCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => ProjectEntity, (project) => project.event)
  projects: ProjectEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.event)
  questions: QuestionEntity[];
}
