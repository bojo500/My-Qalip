import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { UsersService } from './users.service';
import { CoreController } from "../../dist/libs/core/src";
import { User } from "./entities";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateUserDto, UpdateUserDto } from "./dto";

@Controller('users')
export class UsersController  extends  CoreController{
  constructor(private readonly usersService: UsersService) {
    super(usersService)
  }

  @Post()
  @ApiOperation({
    summary: "Create User",
    description: "Provide required fields to create new users",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: User,
    description: "users created",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: User,
    description: "users exists",
  })
  create(@Body() createUsersDto: CreateUserDto) {
    return super.create(createUsersDto);
  }

  @Get(":id")
  findOneById(@Param("id")id:number) {
    return super.findOne(+id);
  }

  @Get()
  findAll() {
    return super.findAll();
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() UpdateUsersDto: UpdateUserDto) {
    return super.update(+id, UpdateUsersDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return super.delete(+id);
  }
}
