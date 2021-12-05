import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CoreEntity } from './core.entity';
import { CoreServiceInterface, GenericResponseInterface } from './interfaces';

@Injectable()
export class CoreService implements CoreServiceInterface {
  findAllRelations: string[];
  findOneRelations: string[];

  constructor(public readonly repository: Repository<CoreEntity>) {
    this.findAllRelations = [];
  }

  async findAll(): Promise<CoreEntity[]> {
    return this.repository.find({ relations: this.findAllRelations });
  }

  async findOne(id) {
    return this.repository.findOne(id, { relations: this.findOneRelations });
  }

  async create(payload: any): Promise<GenericResponseInterface> {
    try {
      await this.repository.create(payload);
    } catch {
      throw new InternalServerErrorException();
    }
    return {
      message: 'Created Successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async update(id: number, payload: any) {
    try {
      await this.repository.save({ ...payload, id });
    } catch {
      throw new InternalServerErrorException();
    }
    return {
      message: 'Updated Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async delete(id: number): Promise<GenericResponseInterface> {
    let item = await this.findOne(id);
    if (!item) {
      throw new NotFoundException();
    }
    try {
      await this.repository.delete(item.id);
    } catch {
      throw new InternalServerErrorException();
    }
    return {
      message: 'Deleted Successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
