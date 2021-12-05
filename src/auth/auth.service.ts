import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { TokenPayloadInterface } from "./interfaces";
import { User } from "../users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user?.password);
      if (isPasswordCorrect) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async login(user: any): Promise<any> {
    let payload: TokenPayloadInterface;
    try {
      payload = { email: user.email, sub: user.id };
    } catch (e) {
      throw new BadRequestException(e);
    }
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  async register(user: RegisterDto): Promise<User> {
    const _user: User = await this.usersService.findOneByEmail(user?.email);
    const _userName: User = await this.usersService.findOneByUsername(user?.userName);
    if (_user || _userName) {
      this.handleBadRequest("Email or username already exists");
    }
    user.password = await bcrypt.hash(user.password, 10);
    return this.usersService.createUser(user);
  }

  handleBadRequest(message: string): void {
    throw new BadRequestException({
      message,
      statusCode: HttpStatus.BAD_REQUEST
    });
  }

  /**
   *   forget password function
   */
  async forgotPassword(email: string): Promise<User> {
    const user: User = await this.userService.findOneByEmail(email);

    return user;
  }

  async checkAuth(token: string): Promise<TokenPayloadInterface> {
    let verifyObject: TokenPayloadInterface;
    try {
      verifyObject = await this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
    return verifyObject;
  }
}
