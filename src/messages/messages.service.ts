import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  private lastId = 1;
  private messages: Message[] = [
    {
      id: 1,
      texto: 'Esse é um recado de teste',
      de: 'João',
      para: 'Maria',
      lido: false,
      data: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  async findAll() {
    return await this.messageRepository.find();
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (message) return message;

    this.throwNotFoundError();
  }

  create(createMessageDto: CreateMessageDto) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...createMessageDto,
      lido: false,
      data: new Date(),
    };
    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    const messageExistsIndex = this.messages.findIndex(msg => msg.id === id);

    if (messageExistsIndex < 0) {
      this.throwNotFoundError();
    }

    if (messageExistsIndex >= 0) {
      const messageExists = this.messages[messageExistsIndex];

      this.messages[messageExistsIndex] = {
        ...messageExists,
        ...updateMessageDto,
      };
    }
    return this.messages[messageExistsIndex];
  }

  remove(id: number) {
    const messageExistsIndex = this.messages.findIndex(msg => msg.id === id);

    if (messageExistsIndex < 0) {
      this.throwNotFoundError();
    }

    const message = this.messages[messageExistsIndex];

    this.messages.splice(messageExistsIndex, 1);

    return message;
  }
}
