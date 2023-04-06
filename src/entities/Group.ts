import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Relation } from 'typeorm';
import { Artist } from './Artist';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  groupId: string;

  @Column()
  name: string;

  @Column()
  albumsSold: number;

  @ManyToMany(() => Artist, (artist) => artist.groups, { cascade: ['insert', 'update'] })
  members: Relation<Artist>[];
}
