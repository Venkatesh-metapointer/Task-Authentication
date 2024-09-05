import {
  AuthenticateFn,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  AuthenticationBindings,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {FindRoute, InvokeMethod, ParseParams, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';

/**
 * Custom sequence for handling requests and responses
 */
export class MySequence implements SequenceHandler {
  constructor(
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
  ) { }

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);

      // Enable JWT authentication
      await this.authenticateRequest(request);

      if (!route) {
        throw new Error('Route not found');
      }

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      // Handle authentication-related errors
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }
      this.reject(context, err);
    }
  }

  reject(context: RequestContext, err: unknown) {
    const {response} = context;
    if (err instanceof Error) {
      response.status(500).json({
        error: {
          message: err.message,
          stack: err.stack,
        },
      });
    } else {
      response.status(500).json({
        error: {
          message: 'An unknown error occurred',
        },
      });
    }
  }

  // send(response: Response<unknown, Record<string, unknown>>, result: unknown) {
  //   response.status(200).json(result);
  // }

  // async invoke(route: Function, args: unknown[]) {
  //   // Assuming route is a controller method or similar
  //   return route(...args);
  // }

  // parseParams(request: Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>, route: Function) {
  //   // Extract parameters from the request
  //   // You may need to adjust this based on how your routes expect parameters
  //   return []; // Return parameters as an array
  // }

  // findRoute(request: Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>) {
  //   // Logic to determine the route from the request
  //   // This is a placeholder; you may need to implement route finding based on your application's needs
  //   return null; // Return the route that matches the request or throw an error if not found
  // }
}
