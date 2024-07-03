import { Controller } from '@nestjs/common';
import { EndorsementsService } from './endorsements.service';

@Controller('endorsements')
export class EndorsementsController {
  constructor(private readonly endorsementsService: EndorsementsService) {}
}
