import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RoleProtected, Auth } from './decorators';
import { User } from './entities';
import { UserRoleGuard } from './guards';
import { ValidRoles } from './interfaces';

@ApiTags( 'Auth' )
@Controller( 'auth' )
export class AuthController {

  constructor ( private readonly authService: AuthService ) { }

  @Post( 'register' )
  createUser ( @Body() createUserDto: CreateUserDto ) {

    return this.authService.create( createUserDto );

  }

  @Post( 'login' )
  loginUser ( @Body() loginUserDto: LoginUserDto ) {

    return this.authService.login( loginUserDto );

  }

  @Auth()
  @Get( 'check-status' )
  checkAuthStatus ( @GetUser() user: User ) {

    return this.authService.checkAuthStatus( user );

  }

  @Get( 'private' )
  @UseGuards( AuthGuard() )
  testingPrivateRoute ( @GetUser( [ 'roles' ] ) user: User ) {

    return {
      message: 'This is a private route',
      ok: true,
      user
    };

  }

  @Get( 'private2' )
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2 ( @GetUser() user: User ) {

    return {
      message: 'This is a private route 2',
      ok: true,
      user
    };

  }

  @Get( 'private3' )
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  testingPrivateRoute3 ( @GetUser() user: User ) {

    return {
      message: 'This is a private route 2',
      ok: true,
      user
    };

  }


}


