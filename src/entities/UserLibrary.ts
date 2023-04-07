import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserLibrary {
  @PrimaryGeneratedColumn('uuid')
  likedSongs: string;

  @Column()
  songID: string; // Foreign key that references back to class Song

  @Column()
  userID: string; // Foreign key that references back to class User
}
