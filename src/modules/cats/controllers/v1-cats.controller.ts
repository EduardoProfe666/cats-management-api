import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
  Query, Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiCreatedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import PaginatedOutDto from '../../../common/dto/pagination/paginated.out.dto';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import CatsService from '../services/cats.service';
import CatOutDto from '../dto/out/cat.out.dto';
import CatSearchInDto from '../dto/in/cat.search.in.dto';
import MiauOutDto from '../dto/out/miau.out.dto';
import CatInDto from '../dto/in/cat.in.dto';
import CatUpdateInDto from '../dto/in/cat.update.in.dto';

@Controller('v1/cats')
@ApiTags('cats')
export default class V1CatsController {
  constructor(
    private readonly catService: CatsService,
  ) {}

  @Get('')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok', type: [CatOutDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Get all Cats' })
  async getAll() {
    return this.catService.getAll();
  }

  @Get('/me')
  @Roles(Role.Owner)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok', type: [CatOutDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Get the current user`s cats by JWT' })
  async getAllMyCats(@Request() req) {
    const ownerId = req.user.userId;
    return this.catService.getByOwner(ownerId);
  }

  @Get('/miau')
  @ApiOkResponse({ description: 'Ok', type: MiauOutDto })
  @ApiOperation({ summary: 'Get a Miau' })
  async getMiau() {
    return this.catService.getMiau();
  }

  @Get('/search')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok', type: PaginatedOutDto<CatOutDto> })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({
    summary: 'Get Cats with Filtering, Ordering and Pagination',
  })
  async get(
    @Query() dto: CatSearchInDto,
  ): Promise<PaginatedOutDto<CatOutDto>> {
    return this.catService.search(dto);
  }

  @Get('/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok', type: CatOutDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Get a Cat by its id' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.catService.getById(id);
  }

  @Post('')
  @Roles(Role.Owner)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Ok', type: CatOutDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Create a new Cat of the current User' })
  async post(@Body() dto: CatInDto, @Request() req) {
    const ownerId = req.user.userId;
    return this.catService.post(dto, ownerId);
  }

  @Put('/:id')
  @Roles(Role.Owner)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Update a Cat of the current user by its id' })
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CatUpdateInDto,
    @Request() req
  ) {
    const ownerId = req.user.userId;
    return this.catService.put(id, dto, ownerId);
  }


  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Delete PERMANENTLY a Cat of the current user by its id.' })
  async delete(@Param('id', ParseIntPipe, ) id: number, @Request() req) {
    const ownerId = req.user.userId;
    return this.catService.delete(id, ownerId);
  }
}