import {TokenService} from '@loopback/authentication';
import {Credentials, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody, response
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {MyUserService} from '../services';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject('services.MyUserService')
    public userService: MyUserService,
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) { }

  /**
   * User signup method.
   * Creates a new user in the system after checking if the email already exists.
   */
  @post('/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async signup(@requestBody() userData: Omit<User, 'id'>): Promise<User> {
    try {
      console.log('signup ==============> ', userData)
      // Check if a user with the provided email already exists
      const existingUser = await this.userRepository.findOne({
        where: {email: userData.email},
      });
      if (existingUser) {
        throw new HttpErrors.Conflict('User with this email already exists');
      }

      // Create a new user and save it to the database
      return await this.userRepository.create(userData);
    } catch (error) {
      throw new HttpErrors.BadRequest(`Error during signup: ${error.message}`);
    }
  }

  @post('/login')
  @response(200, {
    description: 'JWT Token for user',
    content: {'application/json': {schema: {type: 'object', properties: {token: {type: 'string'}}}}},
  })
  async login(@requestBody() credentials: Credentials): Promise<{token: string}> {
    try {
      // Verify the user's credentials (email and password)
      const user = await this.userService.verifyCredentials(credentials);

      // Convert the user to a UserProfile object which will be used for token generation
      const userProfile = this.userService.convertToUserProfile(user);

      // Generate a JWT token for the authenticated user
      const token = await this.jwtService.generateToken(userProfile);

      // Return the generated JWT token
      return {token};
    } catch (error) {
      // Throw an Unauthorized error if credentials are invalid
      throw new HttpErrors.Unauthorized(`Invalid credentials: ${error.message}`);
    }
  }

  @get('/whoami')
  @response(200, {
    description: 'Current user profile',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async whoami(@param.header.string('Authorization') authHeader: string): Promise<UserProfile> {
    try {
      // Extract the token from the 'Authorization' header
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        // If no token is provided, throw an Unauthorized error
        throw new HttpErrors.Unauthorized('Authorization header is missing or invalid');
      }

      // Verify the JWT token to extract the user profile
      const userProfile = await this.jwtService.verifyToken(token);

      // Return the user profile associated with the valid token
      return userProfile;
    } catch (error) {
      // Throw an Unauthorized error if token verification fails
      throw new HttpErrors.Unauthorized(`Invalid token: ${error.message}`);
    }
  }
}
