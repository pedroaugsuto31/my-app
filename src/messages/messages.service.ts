import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
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

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    const message = this.messages.find(msg => msg.id === +id);

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

  update(id: string, updateMessageDto: UpdateMessageDto) {
    const messageExistsIndex = this.messages.findIndex(msg => msg.id === +id);

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

  remove(id: string) {
    const messageExistsIndex = this.messages.findIndex(msg => msg.id === +id);

    if (messageExistsIndex < 0) {
      this.throwNotFoundError();
    }

    const message = this.messages[messageExistsIndex];

    this.messages.splice(messageExistsIndex, 1);

    return message;
  }
}
