
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Song {

    @PrimaryGeneratedColumn('uuid')
    songID: string;

    @Column({ unique: true, default: null })
    songTitle: string;

    @Column({ default: null })
    artist: string;

    @Column({ default: null })
    album: string;

    @Column({ default: null })
    genera: string;

    @CreateDateColumn()
    releaseYear: number;

}