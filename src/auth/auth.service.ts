import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Users } from "../users/entities/users.entity";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { TokenPayloadInterface } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
  ) {
  }

  async validateUser(email: string, password: string): Promise<Users> {
    const user: Users = await this.usersService.findOneByEmail(email);
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
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterDto): Promise<Users> {
    const _user: Users = await this.usersService.findOneByEmail(user?.email);
    const _userName: Users = await this.usersService.findOneByUsername(user?.userName);
    if (_user || _userName) {
      this.handleBadRequest("Email or username already exists");
    }
    user.password = await bcrypt.hash(user.password, 10);
    return this.usersService.createUser(user);
  }

  handleBadRequest(message: string): void {
    throw new BadRequestException({
      message,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  /**
   *   forget password function
   */
  async forgotPassword(email: string): Promise<Users> {
    const user: Users = await this.usersService.findOneByEmail(email);

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
