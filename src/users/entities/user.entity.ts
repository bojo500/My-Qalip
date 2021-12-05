import { Column, Entity } from "typeorm";
import { CoreEntity } from "../../../libs/core/src";

@Entity()
export class User extends CoreEntity{

  @Column()
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;
}
