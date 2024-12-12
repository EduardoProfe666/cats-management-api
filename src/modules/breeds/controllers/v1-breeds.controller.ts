import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse,
  ApiForbiddenResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import BreedsService from '../services/breeds.service';
import BreedOutDto from '../dto/out/breed.out.dto';
import PaginatedOutDto from '../../../common/dto/pagination/paginated.out.dto';
import BreedSearchInDto from '../dto/in/breed.search.in.dto';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import BreedInDto from '../dto/in/breed.in.dto';
import BreedUpdateInDto from '../dto/in/breed.update.in.dto';

@Controller('v1/breeds')
@ApiTags('breeds')
export default class V1BreedsController {
  constructor(
    private readonly breedService: BreedsService,
  ) {}

  @Get('')
  @ApiOkResponse({ description: 'Ok', type: [BreedOutDto] })
  @ApiOperation({ summary: 'Get all Breeds' })
  async getAll() {
    return this.breedService.getAll();
  }

  @Get('/search')
  @ApiOkResponse({ description: 'Ok', type: PaginatedOutDto<BreedOutDto> })
  @ApiOperation({
    summary: 'Get Breeds with Filtering, Ordering and Pagination',
  })
  async get(
    @Query() dto: BreedSearchInDto,
  ): Promise<PaginatedOutDto<BreedOutDto>> {
    return this.breedService.search(dto);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Ok', type: BreedOutDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Get a Breed by its id' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.breedService.getById(id);
  }

  @Post('')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Ok', type: BreedOutDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({
    description:
      'Conflict (Other Breed with Name)',
  })
  @ApiOperation({ summary: 'Create a new Breed if does not exist' })
  async post(@Body() dto: BreedInDto) {
    return this.breedService.post(dto);
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({
    description:
      'Conflict (Other breed with Name)',
  })
  @ApiOperation({ summary: 'Update a Breed by its id' })
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BreedUpdateInDto,
  ) {
    return this.breedService.patch(id, dto);
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
  @ApiOperation({ summary: 'Delete PERMANENTLY a Breed by its id. For better integrity change isActive in PATCH' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.breedService.delete(id);
  }
}