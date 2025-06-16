import { Controller, Get } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  @Get()
  findAll() {
    return 'Essa rota retorna todos os recados';
  }

  @Get(':id')
  findOne() {
    return 'Essa rota retorna UM recados';
  }
}
