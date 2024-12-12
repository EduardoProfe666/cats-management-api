import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import PgService from '../../database/services/pg.service';
import { JwtService } from '@nestjs/jwt';
import RegisterInDto from '../dto/in/register.in.dto';
import UserOutDto from '../dto/out/user.out.dto';
import { Role } from '../../../common/decorators/roles.decorator';

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly pgService: PgService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.pgService.users.findOne({
      where: { email, isActive: true },
    });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      email: user.email,
      name: user.name,
      userId: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '30d' },
    );

    const rt = await this.pgService.refreshTokens.findOne({
      where: { userId: user.id },
    });

    if (!rt) {
      const newRT = this.pgService.refreshTokens.create({
        userId: user.id,
        refreshToken: refreshToken,
      });

      await this.pgService.refreshTokens.save(newRT);
      this.logger.log(`Created new refresh token for User ${user.id}`);
    } else {
      await this.pgService.refreshTokens.update(rt.id, {
        refreshToken: refreshToken,
      });
    }

    this.logger.log(`Authenticated User ${user.id}`);

    return { accessToken, refreshToken };
  }

  async refresh(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken);
      const userId = payload.sub;

      const rt = await this.pgService.refreshTokens.findOne({
        where: { userId },
      });

      if (!rt || rt.refreshToken !== oldRefreshToken) {
        throw new Error();
      }

      const user = await this.pgService.users.findOne({
        where: { id: rt.userId },
      });

      if (!user) {
        throw new Error();
      }

      const newPayload = {
        username: user.username,
        email: user.email,
        name: user.name,
        userId: user.id,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '30d' },
      );

      if (!rt) {
        const newRT = this.pgService.refreshTokens.create({
          userId: user.id,
          refreshToken: refreshToken,
        });

        await this.pgService.refreshTokens.save(newRT);
        this.logger.log(`Created new refresh token for User ${user.id}`);
      } else {
        await this.pgService.refreshTokens.update(rt.id, {
          refreshToken: refreshToken,
        });
      }

      this.logger.log(`Created new refresh token for User ${rt.userId}`);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.log('Refresh token failed', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.pgService.users.findOne({
      where: { id: userId },
    });
    if (!user || !(await user.validatePassword(oldPassword))) {
      throw new BadRequestException('Invalid credentials');
    }

    user.password = newPassword;

    await this.pgService.users.save(user);

    this.logger.log(`Updated user Password with ID ${user.id}`);
  }

  async register(dto: RegisterInDto): Promise<UserOutDto> {
    const existingUserUsername = await this.pgService.users.findOne({
      where: { username: dto.username },
    });
    if (existingUserUsername) {
      throw new ConflictException(
        `User with username "${dto.username}" already exists`,
      );
    }

    const existingUserEmail = await this.pgService.users.findOne({
      where: { email: dto.email },
    });
    if (existingUserEmail) {
      throw new ConflictException(
        `User with email "${dto.email}" already exists`,
      );
    }

    const newUser = this.pgService.users.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role: Role.Owner,
      name: dto.name,
      isActive: true,
      lastnames: dto.lastnames,
      phoneNumber: dto.phoneNumber,
    });

    await this.pgService.users.save(newUser);
    this.logger.log(`Created new user with ID ${newUser.id}`);

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isActive: newUser.isActive,
      phoneNumber: newUser.phoneNumber,
      lastNames: newUser.lastnames,
    };
  }
}
