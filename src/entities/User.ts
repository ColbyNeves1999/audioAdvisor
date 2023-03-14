import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from 'typeorm';

import { AvatarPhoto } from './AvatarPhoto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 0 })
  profileViews: number;

  @Column({ unique: true, default: null })
  spotifyAuth: string;

  @Column({ unique: true, default: null })
  refreshAuth: string;

  @OneToOne(() => AvatarPhoto, (avatarPhoto) => avatarPhoto.user)
  @JoinColumn()
  avatarPhoto: Relation<AvatarPhoto>;
}
