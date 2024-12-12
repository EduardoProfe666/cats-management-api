import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import UsersService from '../services/users.service';
import UserOutDto from '../dto/out/user.out.dto';
import UserInDto from '../dto/in/user.in.dto';
import UserUpdateInDto from '../dto/in/user.update.in.dto';
import UserSearchInDto from '../dto/in/user.search.in.dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import PaginatedOutDto from '../../../common/dto/pagination/paginated.out.dto';
import UserWithCatsOutDto from '../dto/out/user-with-cats.out.dto';

@Controller('v1/users')
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
export default class V1UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @Roles(Role.Admin)
  @ApiOkResponse({ description: 'Ok', type: [UserWithCatsOutDto] })
  @ApiOperation({ summary: 'Get all Users' })
  async getAll() {
    return this.usersService.getAll();
  }

  @Get('/search')
  @Roles(Role.Admin)
  @ApiOkResponse({ description: 'Ok', type: PaginatedOutDto<UserOutDto> })
  @ApiOperation({
    summary: 'Get Users with Filtering, Ordering and Pagination',
  })
  async get(
    @Query() dto: UserSearchInDto,
  ): Promise<PaginatedOutDto<UserOutDto>> {
    return this.usersService.search(dto);
  }

  @Get('/:id')
  @Roles(Role.Admin)
  @ApiOkResponse({ description: 'Ok', type: UserWithCatsOutDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Get a User by its id' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(id);
  }

  @Post('')
  @Roles(Role.Admin)
  @ApiCreatedResponse({ description: 'Ok', type: UserOutDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({
    description: 'Conflict (Other user with Username or Email)',
  })
  @ApiOperation({ summary: 'Create a new User if does not exist' })
  async post(@Body() dto: UserInDto) {
    return this.usersService.post(dto);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({
    description: 'Conflict (Other user with Username or Email)',
  })
  @ApiOperation({ summary: 'Update a User by its id' })
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateInDto,
  ) {
    return this.usersService.patch(id, dto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @ApiOkResponse({ description: 'Ok' })
  @ApiConflictResponse({
    description:
      'Conflict (Current user cannot be deleted)',
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({
    summary:
      'Delete PERMANENTLY a User by its id. For better integrity change isActive in PATCH',
  })
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const username = req.user.username;
    return this.usersService.delete(id, username);
  }

  @Post('/me')
  @Roles(Role.Admin, Role.Owner)
  @ApiCreatedResponse({ description: 'Current user', type: UserWithCatsOutDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Get the current user by username from JWT' })
  async getMe(@Request() req): Promise<UserOutDto> {
    const username = req.user.username;
    return this.usersService.getByUsername(username);
  }
}