import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EventEntity } from './event.entity';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'questions' })
export class QuestionEntity {
  @PrimaryColumn({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'project_id', type: 'uuid', nullable: true })
  projectId?: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'answer', type: 'text', nullable: true })
  answer?: string;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string; // 未承認/承認/却下

  @Column({ name: 'is_anonymous', type: 'boolean' })
  isAnonymous: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => EventEntity, (event) => event.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.questions, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity;
}
