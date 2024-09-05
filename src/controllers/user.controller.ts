import {inject} from '@loopback/core';
import {post, get, requestBody, response, param, getModelSchemaRef} from '@loopback/rest';
import {TokenService} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {User} from '../models';
import {TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {Credentials, MyUserService} from '@loopback/authentication-jwt';
import {HttpErrors} from '@loopback/rest';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async signup(@requestBody() user: Omit<User, 'id'>): Promise<User> {
    try {
      // Check if the user already exists
      const existingUser = await this.userRepository.findOne({where: {email: user.email}});
      if (existingUser) {
        throw new HttpErrors.Conflict('User already exists');
      }
      // Create new user
      return await this.userRepository.create(user);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Error signing up user: ${error.message}`);
    }
  }

  @post('/login')
  @response(200, {
    description: 'JWT Token for user',
    content: {'application/json': {schema: {type: 'object', properties: {token: {type: 'string'}}}}},
  })
  async login(@requestBody() credentials: Credentials): Promise<{token: string}> {
    try {
      const user = await this.userService.verifyCredentials(credentials);
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      return {token};
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Invalid credentials: ${error.message}`);
    }
  }

  @get('/whoami')
  @response(200, {
    description: 'Current user profile',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async whoami(@param.query.string('token') token: string): Promise<UserProfile> {
    try {
      const userProfile = await this.jwtService.verifyToken(token);
      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Invalid token: ${error.message}`);
    }
  }
}
