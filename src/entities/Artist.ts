import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Relation, JoinTable } from 'typeorm';
import { Group } from './Group';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  artistID: string;

  @Column()
  name: string;

  @Column()
  songID: string; // References back to class Song

  @Column()
  userID: string; // References back to class User

  @ManyToMany(() => Group, (group) => group.members, { cascade: ['insert', 'update'] })
  @JoinTable()
  groups: Relation<Group>[];
}
