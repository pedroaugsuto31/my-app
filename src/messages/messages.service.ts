import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonsService } from '../persons/persons.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly personsService: PersonsService,
  ) {}

  throwNotFoundError(): never {
    throw new NotFoundException('Recado não encontrado');
  }

  async create(createMessageDto: CreateMessageDto) {
    const { fromId, toId } = createMessageDto;

    const from = await this.personsService.findOne(fromId);
    const to = await this.personsService.findOne(toId);

    const newMessage = {
      text: createMessageDto.text,
      from,
      to,
      lido: false,
      data: new Date(),
    };
    const message = this.messageRepository.create(newMessage);

    await this.messageRepository.save(message);

    return {
      ...message,
      from: {
        id: message.from.id,
      },
      to: {
        id: message.to.id,
      },
    };
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto ?? {};

    return await this.messageRepository.find({
      take: limit,
      skip: offset,
      relations: ['from', 'to'],
      order: { createdAt: -1 },
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    if (!message) return this.throwNotFoundError();

    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);

    message.text = updateMessageDto?.text ?? message.text;
    message.read = updateMessageDto?.read ?? message.read;

    await this.messageRepository.save(message);
    return message;
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.remove(message);
  }
}
