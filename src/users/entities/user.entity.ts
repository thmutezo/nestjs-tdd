import { ObjectID } from 'mongodb';

export class User {
  _id: ObjectID;
  user_info: {
    firstname: string;
    initials: string;
    surname: string;
  };
  username: string;
  email: string;
  password: string;
  createdDate: string;
  admin: boolean;
}
