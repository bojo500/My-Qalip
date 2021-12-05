import { HttpStatus } from '@nestjs/common';

export interface GenericResponseInterface {
  message: string;
  statusCode: HttpStatus;
}
