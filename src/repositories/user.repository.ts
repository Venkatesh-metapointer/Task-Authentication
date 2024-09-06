import {UserCredentialsRepository} from '@loopback/authentication-jwt';
import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, juggler, repository} from '@loopback/repository';
import {User, UserRelations, Usercredentials} from '../models';
import {UsercredentialsRepository} from './usercredentials.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly usercredentials: HasOneRepositoryFactory<Usercredentials, typeof User.prototype.id>;

  constructor(
    @inject(`datasources.localDB`)
    dataSource: juggler.DataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>, @repository.getter('UsercredentialsRepository') protected usercredentialsRepositoryGetter: Getter<UsercredentialsRepository>,
  ) {
    super(User, dataSource);
    this.usercredentials = this.createHasOneRepositoryFactoryFor('usercredentials', usercredentialsRepositoryGetter);
    this.registerInclusionResolver('usercredentials', this.usercredentials.inclusionResolver);


  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<Usercredentials | undefined> {
    return this.usercredentials(userId)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }
}
