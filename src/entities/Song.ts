import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Song {

  @PrimaryGeneratedColumn('uuid')
  songID: string;

  @Column({ default: null })
  songTitle: string;

  @Column({ default: null })
  artist: string;

  @Column({ default: null })
  album: string;

  @Column({ default: null })
  genre: string;

  @Column({ default: null })
  preview: string;

  @CreateDateColumn()
  releaseYear: string;

}
