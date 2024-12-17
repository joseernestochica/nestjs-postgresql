import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, MoreThan } from 'typeorm';

import { CreateRefreshTokenDto, CreateUserDto, LoginUserDto, UpdateRefreshTokenDto } from './dto';
import { GetParamsDto } from 'src/common/dto';
import { HandleErrorService } from 'src/common/services';
import { JwtPayload } from './interfaces';
import { RefreshToken, User } from './entities';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { GetParams, GetResponse } from 'src/common/interfaces';
import { createQueryBuilder } from 'src/common/helpers';

@Injectable()
export class AuthService {

  constructor (

    @InjectRepository( RefreshToken )
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private readonly handleErrorService: HandleErrorService,
    private readonly jwtService: JwtService

  ) { }

  private getJwtToken ( payload: JwtPayload ): string {

    return this.jwtService.sign( payload );

  }

  private async createRefreshToken ( user: User, ip: string ): Promise<string> {

    try {

      await this.refreshTokenRepository.delete( { user: user } );
      const refreshTokenUid = uuidv4();

      const refreshTokenBody: RefreshToken = {
        user: user,
        token: refreshTokenUid,
        created: new Date(),
        expires: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 ),
        ip
      };

      const refreshToken = this.refreshTokenRepository.create( refreshTokenBody as Object );
      await this.refreshTokenRepository.save( refreshToken );
      return refreshTokenUid;

    } catch ( error ) {
      this.handleErrorService.handleDBException( error );
    }

  }

  async create ( createUserDto: CreateUserDto ) {

    try {

      const user = this.userRepository.create( createUserDto );
      await this.userRepository.save( user );

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken( { id: user.id } )
      };

    }
    catch ( error ) {
      this.handleErrorService.handleDBException( error );
    }

  }

  async findAll ( getParamsDto: GetParamsDto ): Promise<GetResponse<User>> {

    const getParams: GetParams = {};
    getParams.page = getParamsDto.page;
    getParams.limit = getParamsDto.limit;
    getParams.sort = { column: getParamsDto.sortColumn || 'id', direction: getParamsDto.sortDirection || 'DESC' };
    getParams.select = getParamsDto.select && getParamsDto.select !== '' ? getParamsDto.select.split( '|' ) : [];
    getParams.search = getParamsDto.search && getParamsDto.search.trim() !== '' ? getParamsDto.search.trim() : undefined;

    if ( getParams.search ) {
      getParams.where = {
        query: `user.fullName LIKE :s 
          OR user.email LIKE :s`,
        params: {
          s: `%${ getParams.search }%`,
        }
      };
    }

    getParams.andWhere = [];
    if ( getParamsDto.sgStr1 && getParamsDto.sgStr1.trim() !== '' ) {
      getParams.andWhere.push( { field: 'email', value: getParamsDto.sgStr1.trim() } );
    }
    if ( getParamsDto.sgStr2 && getParamsDto.sgStr2.trim() !== '' ) {
      getParams.andWhere.push( { field: 'fullName', value: getParamsDto.sgStr2.trim() } );
    }
    if ( getParamsDto.sgInt1 ) {
      getParams.andWhere.push( { field: 'isActive', value: getParamsDto.sgInt1 === 1 ? true : false } );
    }

    const getResponse = await createQueryBuilder<User>( this.userRepository, getParams, 'user' );
    if ( !getResponse || ( getResponse.data as User[] ).length === 0 ) {
      this.handleErrorService.handleNotFoundException( 'Users not found' );
    }

    ( getResponse.data as User[] ).forEach( user => delete user.password );

    getResponse.message = 'Users list';
    getResponse.statusCode = 200;

    return getResponse;

  }

  async findOne ( id: string ): Promise<GetResponse<User>> {

    const user = await this.userRepository.findOne( { where: { id } } );

    if ( !user ) {
      this.handleErrorService.handleNotFoundException( 'User not found' );
    }

    delete user.password;

    return {
      data: user,
      message: 'User found',
      statusCode: 200
    };

  }

  async login ( loginUserDto: LoginUserDto, ip?: string, isHashed = false ): Promise<any> {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne( {
      where: { email },
      select: [ 'id', 'password' ]
    } );

    if ( !user ) {
      this.handleErrorService.handleUnautorizedException( 'User not found (email)' );
    }

    if ( !isHashed ) {
      if ( !bcrypt.compareSync( password, user.password ) ) {
        this.handleErrorService.handleUnautorizedException( 'Invalid password' );
      }
    } else {
      if ( password !== user.password ) {
        this.handleErrorService.handleUnautorizedException( 'Invalid password' );
      }
    }

    const refreshTokenUid = await this.createRefreshToken( user, ip );
    delete user.password;

    return {
      ...user,
      token: this.getJwtToken( { id: user.id } ),
      refreshToken: refreshTokenUid
    };

  }

  async checkAuthStatus ( user: User ) {

    return {
      ...user,
      token: this.getJwtToken( { id: user.id } )
    };

  }

  async refreshToken ( updateTokenDto: UpdateRefreshTokenDto ): Promise<any> {

    const { refreshToken, userId, ip } = updateTokenDto;

    const userDb = await this.findOne( userId );

    const count = await this.refreshTokenRepository.count(
      { where: { user: userDb.data as User, token: refreshToken, expires: MoreThan( new Date ) } }
    );
    if ( count === 0 ) {
      this.handleErrorService.handleUnautorizedException( 'Invalid token' );
    }

    return await this.login( userDb.data as LoginUserDto, ip, true );

  }

}
