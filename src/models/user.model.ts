import {Entity, model, property, hasOne} from '@loopback/repository';
import {Usercredentials} from './usercredentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  phoneNumber: number;

  @property({
    type: 'string'
  })
  email: string;

  @property({
    type: 'string'
  })
  password: string;

  @property({
    type: 'string'
  })
  username: string;

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @hasOne(() => Usercredentials)
  usercredentials: Usercredentials;
  // @property({
  //   type: 'string',
  // })
  // verificationToken?: string;




  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
