import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import PgService from '../../database/services/pg.service';
import UserOutDto from '../dto/out/user.out.dto';
import User from '../../database/entities/user.entity';
import UserInDto from '../dto/in/user.in.dto';
import UserUpdateInDto from '../dto/in/user.update.in.dto';
import UserSearchInDto from '../dto/in/user.search.in.dto';
import { JwtService } from '@nestjs/jwt';
import PaginatedOutDto from '../../../common/dto/pagination/paginated.out.dto';
import createPatchFields from '../../../common/dto/patch/patch-fields.util';
import UserWithCatsOutDto from '../dto/out/user-with-cats.out.dto';

@Injectable()
export default class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly pgService: PgService,
  ) {
  }

  public async search(
    dto: UserSearchInDto,
  ): Promise<PaginatedOutDto<UserOutDto>> {
    const queryBuilder = this.pgService.users.createQueryBuilder('user');

    // Filtering
    if (dto.search) {
      queryBuilder.where(
        'user.username ILIKE :search OR user.email ILIKE :search OR user.lastnames ILIKE :search OR user.name ILIKE :search',
        {
          search: `%${dto.search}%`,
        },
      );
    }

    if (dto.isActive !== undefined && dto.isActive !== null) {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: dto.isActive,
      });
    }

    if (dto.role !== undefined && dto.role !== null) {
      queryBuilder.andWhere('user.role = :role', {
        role: dto.role,
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

    const usersOut = result.map((user) => this.toOutDto(user));

    return {
      data: usersOut,
      total,
      page: dto.page,
      pageSize: dto.pageSize,
      hasNextPage: dto.page * dto.pageSize < total,
      hasPreviousPage: dto.page > 1,
    };
  }

  public async getAll(): Promise<UserOutDto[]> {
    const users = await this.pgService.users.find({
      relations: ['cats']
    });

    return users.map((user) => this.toOutDtoWithCats(user));
  }

  public async getById(id: number): Promise<UserOutDto> {
    const user = await this.pgService.users.findOne({
      where: { id },
      relations: ['cats'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toOutDtoWithCats(user);
  }

  public async getByUsername(username: string): Promise<UserOutDto> {
    const user = await this.pgService.users.findOne({
      where: { username },
      relations: ['cats'],
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return this.toOutDtoWithCats(user);
  }

  public async post(dto: UserInDto): Promise<UserOutDto> {
    const existingUserByUsername = await this.pgService.users.findOne({
      where: { username: dto.username },
    });
    if (existingUserByUsername) {
      throw new ConflictException(
        `User with username "${dto.username}" already exists`,
      );
    }

    const existingUserByEmail = await this.pgService.users.findOne({
      where: { email: dto.email },
    });
    if (existingUserByEmail) {
      throw new ConflictException(
        `User with email "${dto.email}" already exists`,
      );
    }

    const newUser = this.pgService.users.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      name: dto.name,
      isActive: true,
      lastnames: dto.lastnames,
      phoneNumber: dto.phoneNumber,
    });
    await this.pgService.users.save(newUser);

    this.logger.log(`Created new user with ID ${newUser.id}`);

    return this.toOutDto(newUser);
  }

  public async patch(id: number, dto: UserUpdateInDto): Promise<void> {
    if (dto.username) {
      const user = await this.pgService.users.findOne({
        where: { username: dto.username },
      });

      if (user && user.id !== id) {
        throw new ConflictException(
          `User with username "${dto.username}" already exists`,
        );
      }
    }

    if (dto.email) {
      const user = await this.pgService.users.findOne({
        where: { email: dto.email },
      });

      if (user && user.id !== id) {
        throw new ConflictException(
          `User with email "${dto.email}" already exists`,
        );
      }
    }

    const user = await this.pgService.users.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const patchDto = createPatchFields(dto);

    await this.pgService.users.update(id, patchDto);
    this.logger.log(`Updated user with ID ${id}`);
    this.logger.log({ ...patchDto });
  }

  public async delete(id: number, username: string): Promise<void> {
    const user = await this.pgService.users.findOne({ where: { username } });
    if (user.id === id) {
      throw new ConflictException(
        `Current User with ID ${id} cannot be deleted`,
      );
    }

    const result = await this.pgService.users.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`Deleted user with ID ${id}`);
  }

  private toOutDto(user: User): UserOutDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      lastnames: user.lastnames,
      phoneNumber: user.phoneNumber,
    };
  }

  private toOutDtoWithCats(user: User): UserWithCatsOutDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      lastnames: user.lastnames,
      phoneNumber: user.phoneNumber,
      cats: user.cats.map(x => ({
        id: x.id,
        name: x.name,
      })),
    };
  }
}
