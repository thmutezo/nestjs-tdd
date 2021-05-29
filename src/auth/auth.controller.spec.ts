import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { Db, MongoClient, ObjectID } from 'mongodb';
import { UsersModule } from './../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthModule } from './auth.module';

const existingUserDto = {
  _id: new ObjectID('608c80e4e88ebb34f4dc93f3'),
  user_info: { firstname: 'Tafadzwa', initials: 'H', surname: 'Mutezo' },
  username: 'tafa',
  email: 'fidwa16@gmail.com',
  password: 'happy123',
  createdDate: '1619820767206',
  admin: true,
};

dotenv.config();
describe('AuthController', () => {
  let controller: AuthController;
  // const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const mockGuard: CanActivate = { canActivate: () => true };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideGuard(AuthGuard()) //not working
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('auth controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  // describe('auth/login', () => {
  //   it('should login user', async (done) => {
  //     // const loggedInUser = await controller.login({
  //     // username: existingUserDto.username,
  //     // password: existingUserDto.password,
  //     // });
  //     const { password, ...newExistingUserDto } = existingUserDto;
  //     // expect(loggedInUser).toBeTruthy();
  //     // expect(loggedInUser).not.toContain(existingUserDto.password);
  //     // expect(loggedInUser).toStrictEqual(newExistingUserDto);
  //     const loggedInUser = await controller.login({
  //       username: existingUserDto.username,
  //       password: existingUserDto.password,
  //     });
  //     // expect(loggedInUser).toStrictEqual(newExistingUserDto);
  //     expect(
  //       await controller.login({
  //         username: existingUserDto.username,
  //         password: existingUserDto.password,
  //       }),
  //     ).toStrictEqual(newExistingUserDto);
  //     done();
  //   });
  //   // it('should return error if failed to login', async () => {
  //   //   expect.assertions(1);
  //   //   try {
  //   //     const loggedInUser = await controller.login({
  //   //       username: 'falseUsername',
  //   //       password: 'falsePassword',
  //   //     });
  //   //   } catch (e) {
  //   //     expect(e).toEqual(
  //   //       new HttpException(
  //   //         'Login failed. Username or Password is wrong',
  //   //         HttpStatus.NOT_FOUND,
  //   //       ),
  //   //     );
  //   //   }
  //   // });
  // });
});
