import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'votes' })
export class VoteEntity {
  @PrimaryColumn({ name: 'vote_id', type: 'uuid' })
  voteId: string;

  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'participant_id', type: 'varchar', length: 255 })
  participantId: string;

  @Column({ name: 'voted_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  votedAt: Date;

  @ManyToOne(() => ProjectEntity, (project) => project.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
