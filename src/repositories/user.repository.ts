import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocalDbDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  findCredentials(email: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @inject('datasources.localDB') dataSource: LocalDbDataSource,
  ) {
    super(User, dataSource);
  }
}
