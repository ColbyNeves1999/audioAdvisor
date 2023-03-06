import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  artistID: string;

  @Column()
  songID: string;

  @Column()
  userID: string;
}
