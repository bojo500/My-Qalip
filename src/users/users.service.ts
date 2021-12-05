import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CoreService } from "../../libs/core/src";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities";
import { AuthService } from "../auth/auth.service";
import { CreateUserDto, UpdateUserDto } from "./dto";

@Injectable()
export class UsersService extends CoreService {
  constructor(
    @InjectRepository(User) public repository: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {
    super(repository);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.repository.save(createUserDto);
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.repository.findOne({ userName: username });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }

  async updateProfile(token: string, updateUserDto: UpdateUserDto): Promise<any> {
    const { sub: id } = await this.authService.checkAuth(token);
    return this.update(id, updateUserDto);
  }

  async getProfile(token: string): Promise<User> {
    const { sub: id } = await this.authService.checkAuth(token);
    let user: User;
    try {
      user = await this.repository.findOne(id);
    } catch (e) {
      throw new NotFoundException();
    }
    delete user.password;
    return user;
  }
}