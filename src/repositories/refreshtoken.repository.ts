import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Refreshtoken, RefreshtokenRelations} from '../models';

export class RefreshtokenRepository extends DefaultCrudRepository<
  Refreshtoken,
  typeof Refreshtoken.prototype.id,
  RefreshtokenRelations
> {
  constructor(
    @inject(`datasources.localDB`)
    dataSource: juggler.DataSource,
  ) {
    super(Refreshtoken, dataSource);
  }
}
