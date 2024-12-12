import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import PgService from '../../database/services/pg.service';
import Cat from '../../database/entities/cat.entity';
import CatOutDto from '../dto/out/cat.out.dto';
import CatUpdateInDto from '../dto/in/cat.update.in.dto';
import { Role } from '../../../common/decorators/roles.decorator';
import CatInDto from '../dto/in/cat.in.dto';
import PaginatedOutDto from '../../../common/dto/pagination/paginated.out.dto';
import CatSearchInDto from '../dto/in/cat.search.in.dto';
import MiauOutDto from '../dto/out/miau.out.dto';

@Injectable()
export default class CatsService {
  private readonly logger = new Logger(CatsService.name);

  constructor(
    private readonly pgService: PgService,
  ) {
  }

  public async getMiau(): Promise<MiauOutDto> {
    const miaus = [
      'Miau', 'Miaaaaaau', '¡MIAU!', 'Meow', 'Nyan', 'Miaou', 'Mrrrrrr',
      'Mjau', 'Miu', '¡MIAAAAUUU!', 'Mew', 'miau...', 'Miau?',
    ];

    return {
      miau: miaus[Math.floor(Math.random() * miaus.length)],
    };
  }

  public async search(
    dto: CatSearchInDto,
  ): Promise<PaginatedOutDto<CatOutDto>> {
    const queryBuilder = this.pgService.cats
      .createQueryBuilder('cat')
      .leftJoinAndSelect('cat.breed', 'breed')
      .leftJoinAndSelect('cat.owner', 'owner');

    // Filtering
    if (dto.search) {
      queryBuilder.where(
        'cat.name ILIKE :search',
        {
          search: `%${dto.search}%`,
        },
      );
    }

    if (dto.breedId) {
      queryBuilder.andWhere('breed.id = :breedId', {
        breedId: dto.breedId,
      });
    }

    if (dto.ownerId) {
      queryBuilder.andWhere('owner.id = :ownerId', {
        ownerId: dto.ownerId,
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

    const catOutDtos = result.map((cat) => this.toOutDto(cat));

    return {
      data: catOutDtos,
      total,
      page: dto.page,
      pageSize: dto.pageSize,
      hasNextPage: dto.page * dto.pageSize < total,
      hasPreviousPage: dto.page > 1,
    };
  }

  public async getAll(): Promise<CatOutDto[]> {
    const cats = await this.pgService.cats.find({
      relations: ['owner', 'breed'],
    });

    return cats.map((cat) => this.toOutDto(cat));
  }

  public async getByOwner(ownerId: number): Promise<CatOutDto[]> {
    const cats = await this.pgService.cats.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'breed'],
    });

    return cats.map((cat) => this.toOutDto(cat));
  }

  public async getById(id: number): Promise<CatOutDto> {
    const cat = await this.pgService.cats.findOne({
      where: { id },
      relations: ['owner', 'breed'],
    });
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return this.toOutDto(cat);
  }

  public async post(dto: CatInDto, ownerId: number): Promise<CatOutDto> {
    const owner = await this.pgService.users.findOne({
      where: {
        id: ownerId,
        role: Role.Owner,
        isActive: true,
      },
    });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    }

    const breed = await this.pgService.breeds.findOne({
      where: {
        id: dto.breedId,
        isActive: true,
      },
    });
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${dto.breedId} not found`);
    }

    const newCat = this.pgService.cats.create({
      name: dto.name,
      age: dto.age,
      owner: owner,
      breed: breed,
    });
    await this.pgService.cats.save(newCat);

    this.logger.log(`Created new cat with ID ${newCat.id}`);

    return this.toOutDto(newCat);
  }

  public async put(id: number, dto: CatUpdateInDto, ownerId: number): Promise<void> {
    const cat = await this.pgService.cats.findOne({
      where: { id, owner: { id: ownerId } },
    });
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }

    const owner = await this.pgService.users.findOne({
      where: {
        id: ownerId,
        role: Role.Owner,
        isActive: true,
      },
    });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    }

    const breed = await this.pgService.breeds.findOne({
      where: {
        id: dto.breedId,
        isActive: true,
      },
    });
    if (!breed) {
      throw new NotFoundException(`Breed with ID ${dto.breedId} not found`);
    }

    cat.name = dto.name;
    cat.age = dto.age;
    cat.owner = owner;
    cat.breed = breed;

    await this.pgService.cats.save(cat);

    this.logger.log(`Updated cat with ID ${id}`);
    this.logger.log({ ...dto });
  }

  public async delete(id: number, ownerId: number): Promise<void> {
    const owner = this.pgService.users.findOne({
      where: { id: ownerId, role: Role.Owner, isActive: true, cats: { id: id } },
    });
    if(!owner){
      throw new ForbiddenException(`Cat with Id ${id} does not belongs to Current User`);
    }

    const result = await this.pgService.cats.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    this.logger.log(`Deleted cat with ID ${id}`);
  }

  private toOutDto(cat: Cat): CatOutDto {
    return {
      id: cat.id,
      name: cat.name,
      age: cat.age,
      ownerId: cat.owner.id,
      ownerUsername: cat.owner.username,
      ownerEmail: cat.owner.email,
      ownerName: cat.owner.name,
      breedId: cat.breed.id,
      breedName: cat.breed.name,
    };
  }
}