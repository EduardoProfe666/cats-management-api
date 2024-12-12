import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import PgService from '../../database/services/pg.service';
import PaginatedOutDto from '../../../common/dto/pagination/paginated.out.dto';
import createPatchFields from '../../../common/dto/patch/patch-fields.util';
import Breed from '../../database/entities/breed.entity';
import BreedOutDto from '../dto/out/breed.out.dto';
import BreedUpdateInDto from '../dto/in/breed.update.in.dto';
import BreedInDto from '../dto/in/breed.in.dto';
import BreedSearchInDto from '../dto/in/breed.search.in.dto';

@Injectable()
export default class BreedsService {
  private readonly logger = new Logger(BreedsService.name);

  constructor(
    private readonly pgService: PgService,
  ) {
  }

  public async search(
    dto: BreedSearchInDto,
  ): Promise<PaginatedOutDto<BreedOutDto>> {
    const queryBuilder = this.pgService.breeds.createQueryBuilder('breed');

    // Filtering
    if (dto.search) {
      queryBuilder.where(
        'breed.name ILIKE :search',
        {
          search: `%${dto.search}%`,
        },
      );
    }

    if (dto.isActive !== undefined && dto.isActive !== null) {
      queryBuilder.andWhere('breed.isActive = :isActive', {
        isActive: dto.isActive,
      });
    }

    // Ordering
    const orderBy = dto.orderBy || 'id';
    const orderDirection =
      dto.orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    queryBuilder.orderBy(`user.${orderBy}`, orderDirection);

    // Pagination
    const [result, total] = await queryBuilder
      .skip((dto.page - 1) * dto.pageSize)
      .take(dto.pageSize)
      .getManyAndCount();

    const breedOutDtos = result.map((breed) => this.toOutDto(breed));

    return {
      data: breedOutDtos,
      total,
      page: dto.page,
      pageSize: dto.pageSize,
      hasNextPage: dto.page * dto.pageSize < total,
      hasPreviousPage: dto.page > 1,
    };
  }

  public async getAll(): Promise<BreedOutDto[]> {
    const breeds = await this.pgService.breeds.find({});

    return breeds.map((breed) => this.toOutDto(breed));
  }

  public async getById(id: number): Promise<BreedOutDto> {
    const breed = await this.pgService.breeds.findOne({
      where: { id },
    });
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    return this.toOutDto(breed);
  }

  public async post(dto: BreedInDto): Promise<BreedOutDto> {
    const existingBreedByName = await this.pgService.breeds.findOne({
      where: { name: dto.name },
    });
    if (existingBreedByName) {
      throw new ConflictException(
        `Breed with name "${dto.name}" already exists`,
      );
    }

    const newBreed = this.pgService.breeds.create({
      name: dto.name,
      isActive: true,
    });
    await this.pgService.breeds.save(newBreed);

    this.logger.log(`Created new breed with ID ${newBreed.id}`);

    return this.toOutDto(newBreed);
  }

  public async patch(id: number, dto: BreedUpdateInDto): Promise<void> {
    if (dto.name) {
      const breed = await this.pgService.breeds.findOne({
        where: { name: dto.name },
      });

      if (breed && breed.id !== id) {
        throw new ConflictException(
          `Breed with name "${dto.name}" already exists`,
        );
      }
    }

    const breed = await this.pgService.breeds.findOne({
      where: { id },
    });
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }

    const patchDto = createPatchFields(dto);

    await this.pgService.breeds.update(id, patchDto);
    this.logger.log(`Updated breed with ID ${id}`);
    this.logger.log({ ...patchDto });
  }

  public async delete(id: number): Promise<void> {
    const result = await this.pgService.breeds.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Breed with ID ${id} not found`);
    }
    this.logger.log(`Deleted breed with ID ${id}`);
  }

  private toOutDto(breed: Breed): BreedOutDto {
    return {
      id: breed.id,
      name: breed.name,
    };
  }
}