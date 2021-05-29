import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Action } from '../casl/action';
import { AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies } from '../decorators/check_policy.decorator';
import { PoliciesGuard } from '../guards/policies.guard';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
