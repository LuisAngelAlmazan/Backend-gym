import { MembershipsCustomRepository } from './../memberships/memberships.repository';
import { ClassesCustomRepository } from './../classes/classes.repository';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { UsersCustomRepository } from './users.repository';
import { CreateUserDto } from '../auth/dto/signUpUser.dto';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWithoutPassword } from './types/userWithoutPassword.type';
import { TrainersCustomRepository } from '../trainers/trainers.repository';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersCustomRepository: UsersCustomRepository,
    private trainersCustomRepository: TrainersCustomRepository,
    private classesCustomRepository: ClassesCustomRepository,
    private membershipsCustomRepository: MembershipsCustomRepository,
  ) {}

  async onModuleInit() {
    this.seedDatabase();
  }

  async seedDatabase() {
    setTimeout(() => {
      console.info('Seeding your database');
    }, 1000);
    setTimeout(() => {
      console.info(`
              Seeding users
                👧🧑👱👨
          `);
    }, 1500);
    setTimeout(() => {
      this.userSeeder();
    }, 2000);
    setTimeout(() => {
      console.info(`
          Seeding trainers
            🏃🏽💥🏋‍♀🔥💪🏼
          `);
    }, 10000);
    setTimeout(() => {
      this.trainersCustomRepository.initializeTrainers();
    }, 10500);
    setTimeout(() => {
      console.info(`
          Seeding class
           ⏳⏳⏳⏳⌛
          `);
    }, 11000);
    setTimeout(() => {
      this.classesCustomRepository.initializeClasses();
    }, 11500);
    setTimeout(() => {
      console.info(`
          Seeding memberships
              💎💎💎💎💎
          `);
    }, 12000);
    setTimeout(() => {
      this.membershipsCustomRepository.addMemberships();
    }, 13000);
    setTimeout(() => {
      console.info(`
              Database seeding completed
                ✅✅✅✅✅✅✅✅✅✅
          `);
    }, 15000);
  }

  async userSeeder() {
    return await this.usersCustomRepository.initializeUser();
  }

  async getUser(userID: string): Promise<UserWithoutPassword> {
    const foundUser: User | undefined = await this.usersRepository.findOne({
      where: { id: userID },
    });
    if (!foundUser) throw new NotFoundException('user not found or not exist');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...filteredUser } = foundUser;
    return foundUser;
  }

  async getUsers(
    page: number,
    limit: number,
    sortBy: string,
    order: 'ASC' | 'DESC',
  ) {
    const [users, total] = await this.usersRepository
      .createQueryBuilder('users')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(sortBy, order)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      users,
      sortedBy: sortBy,
      ordered: order,
      totalElements: total,
      page,
      limit,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }

  async getUserById(id: string) {
    return await this.usersCustomRepository.getUserById(id);
  }

  async getUsersByEmail(email: string) {
    return email;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.usersCustomRepository.createUser(createUserDto);
    return newUser;
  }

  async updateUser(id: string, user: any) {
    return await this.usersCustomRepository.updateUser(id, user);
  }

  async deleteUser(id: string) {
    return await this.usersCustomRepository.remove(id);
  }
}
