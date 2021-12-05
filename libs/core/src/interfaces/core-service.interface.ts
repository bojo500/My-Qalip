import { CoreEntity } from "@resume/core/core.entity";

export abstract class CoreServiceInterface {
  abstract create(payload: any): Promise<any>;
  abstract findAll(): Promise<CoreEntity[]>;
  abstract findOne(id: number): Promise<CoreEntity>;
  abstract update(id: number, payload: any): Promise<any>;
  abstract delete(id: number): Promise<any>;
}
