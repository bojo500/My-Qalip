import { CoreControllerInterface } from "./interfaces";
import { CoreService } from "./core.service";
import { CoreEntity } from './core.entity';

export class CoreController implements CoreControllerInterface {
  constructor(public readonly service: CoreService) {
  }

  async findAll(): Promise<CoreEntity[]> {
    return this.service.findAll();
  }

  async findOne(id): Promise<CoreEntity> {
    return this.service.findOne(id);
  }

  async create(payload): Promise<any> {
    return this.service.create(payload);
  }

  update(id, payload): Promise<any> {
    return this.service.update(id, payload);
  }

  async delete(id): Promise<any> {
    return this.service.delete(id);
  }

}
