import { Controller, Get, Post, Body, UseGuards, Query, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateRefreshTokenDto, UpdateUserDto } from './dto';
import { GetUser, RoleProtected, Auth } from './decorators';
import { User } from './entities';
import { UserRoleGuard } from './guards';
import { ValidRoles } from './interfaces';
import { GetParamsDto } from 'src/common/dto';

@ApiTags( 'Auth' )
@Controller( 'auth' )
export class AuthController {

  constructor ( private readonly authService: AuthService ) { }

  @Get( 'users' )
  @Auth( ValidRoles.admin )
  findAll ( @Query() getParamsDto: GetParamsDto ) {

    return this.authService.findAll( getParamsDto );

  }

  @Get( 'user-admin/:id' )
  @Auth( ValidRoles.admin )
  findOneAdmin ( @Param( 'id', ParseUUIDPipe ) id: string ) {

    return this.authService.findOne( id );

  }

  @Get( 'user' )
  @Auth( ValidRoles.user )
  findOneUser ( @GetUser() user: User ) {

    const { id } = user;
    return this.authService.findOne( id );

  }

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

  @Post( 'refresh-token' )
  async refreshToken (
    @Body() updateTokenDto: UpdateRefreshTokenDto
  ) {

    const data = await this.authService.refreshToken( updateTokenDto );

    return {
      message: 'Refresh token ok',
      statusCode: 200,
      data
    };

  }

  @Patch( 'user-admin/:id' )
  @Auth( ValidRoles.admin )
  updateAdmin (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {

    return this.authService.update( id, updateUserDto );

  }

  @Patch( 'user' )
  @Auth( ValidRoles.user, ValidRoles.admin )
  updateUser (
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ) {

    return this.authService.update( user.id, updateUserDto );

  }


}


