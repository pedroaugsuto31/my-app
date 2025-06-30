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

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  create(createMessageDto: CreateMessageDto) {
    const newMessage = {
      ...createMessageDto,
      lido: false,
      data: new Date(),
    };
    const message = this.messageRepository.create(newMessage);

    return this.messageRepository.save(message);
  }

  async findAll() {
    return await this.messageRepository.find();
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) return this.throwNotFoundError();

    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const partialUpdateMessageDto = {
      read: updateMessageDto.read,
      text: updateMessageDto.text,
    };
    const message = await this.messageRepository.preload({
      id,
      ...partialUpdateMessageDto,
    });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.save(message);
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.remove(message);
  }
}
