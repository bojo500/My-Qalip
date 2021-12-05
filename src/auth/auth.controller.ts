import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { LocalAuthGuard } from "./guards";
import { ForgetPasswordDto, RegisterDto } from "./dto";
import { User } from "../users/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * the login
   * @param req
   * @param body
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async login(@Request() req, @Body() body): Promise<User> {
    return this.authService.login(req.user);
  }

  /**
   * the login
   * @param userData
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() userData: RegisterDto): Promise<User> {
    return this.authService.register(userData);
  }

  /**
   * to get the forgot Password
   * @param forgotPasswordDto
   */
  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgetPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

}
