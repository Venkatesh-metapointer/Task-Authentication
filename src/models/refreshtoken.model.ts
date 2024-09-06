import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Refreshtoken extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  refreshtoken: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Refreshtoken>) {
    super(data);
  }
}

export interface RefreshtokenRelations {
  // describe navigational properties here
}

export type RefreshtokenWithRelations = Refreshtoken & RefreshtokenRelations;
