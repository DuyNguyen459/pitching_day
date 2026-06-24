import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EventEntity } from './event.entity';
import { QuestionEntity } from './question.entity';
import { VoteEntity } from './vote.entity';

@Entity({ name: 'projects' })
export class ProjectEntity {
  @PrimaryColumn({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'project_name', type: 'varchar', length: 255 })
  projectName: string;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string; // 準備中/発表中/終了

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => EventEntity, (event) => event.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @OneToMany(() => QuestionEntity, (question) => question.project)
  questions: QuestionEntity[];

  @OneToMany(() => VoteEntity, (vote) => vote.project)
  votes: VoteEntity[];
}
