import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';

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

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    return this.messages.find(msg => msg.id === +id);
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...body,
    };
    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: string, body: any) {
    const messageExistsIndex = this.messages.findIndex(msg => msg.id === +id);

    if (messageExistsIndex >= 0) {
      const messageExists = this.messages[messageExistsIndex];

      this.messages[messageExistsIndex] = {
        ...messageExists,
        ...body,
      };
    }
  }

  remove(id: string) {
    const messageExistsIndex = this.messages.findIndex(msg => msg.id === +id);

    if (messageExistsIndex >= 0) {
      this.messages.splice(messageExistsIndex, 1);
    }
  }
}
