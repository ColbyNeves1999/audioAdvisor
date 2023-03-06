import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserLibrary {
  @PrimaryGeneratedColumn('uuid')
  likedSongs: string;

  @Column()
  songID: string;

  @Column()
  userID: string;
}
