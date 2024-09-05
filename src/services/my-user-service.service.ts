import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';

/*
 * Fix the service type. Possible options can be:
 * - import {MyUserService} from 'your-module';
 * - export type MyUserService = string;
 * - export interface MyUserService {}
 */
export type MyUserService = unknown;

@injectable({scope: BindingScope.TRANSIENT})
export class MyUserServiceProvider implements Provider<MyUserService> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    // Add your implementation here
    throw new Error('To be implemented');
  }
}
