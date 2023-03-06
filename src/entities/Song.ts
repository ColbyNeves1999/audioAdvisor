import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn('uuid')
  songID: string;

  @Column({ unique: true })
  songTitle: string;

  @Column()
  artist: string;

  @Column()
  album: string;

  @Column()
  genera: string;

  @CreateDateColumn()
  releaseYear: number;
}
