import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Library {
  @PrimaryGeneratedColumn('uuid')
  libraryID: string;

  @Column()
  likedSongs: string;

  @Column({ default: 0 })
  libraryList: number;
}
