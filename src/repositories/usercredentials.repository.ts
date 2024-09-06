import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Usercredentials, UsercredentialsRelations} from '../models';

export class UsercredentialsRepository extends DefaultCrudRepository<
  Usercredentials,
  typeof Usercredentials.prototype.id,
  UsercredentialsRelations
> {
  constructor(
    @inject(`datasources.${DbDataSource.dataSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Usercredentials, dataSource);
  }
}
export {Usercredentials};

