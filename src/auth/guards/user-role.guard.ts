import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor (
    private readonly reflector: Reflector,
  ) { }

  canActivate (
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles = this.reflector.get<string[]>( META_ROLES, context.getHandler() ); // Get the roles from the handler

    if ( !validRoles ) { return true; }
    if ( validRoles.length === 0 ) { return true; }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if ( !user ) {
      throw new BadRequestException( 'User not found' );
    };

    for ( const role of user.roles ) {
      if ( validRoles.includes( role ) ) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User with roles '${ user.roles.join( ', ' ) }' is not allowed to access this route. Valid roles are: ${ validRoles.join( ', ' ) }`
    );

  }
}
