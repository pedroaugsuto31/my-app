import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Message } from '../../messages/entities/message.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Message, message => message.from)
  messagesSent: Message[];

  @OneToMany(() => Message, message => message.from)
  messagesReceived: Message[];
}
