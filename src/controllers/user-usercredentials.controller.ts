import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,

  Usercredentials,
} from '../models';
import {UserRepository} from '../repositories';

export class UserUsercredentialsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/usercredentials', {
    responses: {
      '200': {
        description: 'User has one Usercredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usercredentials),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Usercredentials>,
  ): Promise<Usercredentials> {
    return this.userRepository.usercredentials(id).get(filter);
  }

  @post('/users/{id}/usercredentials', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usercredentials)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usercredentials, {
            title: 'NewUsercredentialsInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) usercredentials: Omit<Usercredentials, 'id'>,
  ): Promise<Usercredentials> {
    return this.userRepository.usercredentials(id).create(usercredentials);
  }

  @patch('/users/{id}/usercredentials', {
    responses: {
      '200': {
        description: 'User.Usercredentials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usercredentials, {partial: true}),
        },
      },
    })
    usercredentials: Partial<Usercredentials>,
    @param.query.object('where', getWhereSchemaFor(Usercredentials)) where?: Where<Usercredentials>,
  ): Promise<Count> {
    return this.userRepository.usercredentials(id).patch(usercredentials, where);
  }

  @del('/users/{id}/usercredentials', {
    responses: {
      '200': {
        description: 'User.Usercredentials DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Usercredentials)) where?: Where<Usercredentials>,
  ): Promise<Count> {
    return this.userRepository.usercredentials(id).delete(where);
  }
}
