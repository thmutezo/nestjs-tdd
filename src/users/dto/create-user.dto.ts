export class CreateUserDto {
  user_info: {
    firstname: string;
    initials: string;
    surname: string;
  };
  username: string;
  email: string;
  password: string;
}
