import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GameWinner {
  @PrimaryGeneratedColumn('uuid')
  userID: string;
  // References back to class User usesID is a
  // foreign key but also the primary key here

  @Column({ default: 0 })
  gamesPlayed: number;

  @Column({ default: 0 })
  gamesWon: number;

  @Column({ default: 0 })
  questionsCorrect: number;
}
