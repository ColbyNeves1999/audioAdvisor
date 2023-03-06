import { Entity, Column } from 'typeorm';

@Entity()
export class GameWinner {
  @Column()
  userID: string;

  @Column()
  songID: string;

  @Column()
  libraryID: string;

  @Column({ default: 0 })
  gamesPlayed: number;

  @Column({ default: 0 })
  gamesWon: number;
}
