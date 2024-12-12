import { Injectable } from '@nestjs/common';
import { CreateRefreshTokenDto, CreateUserDto, LoginUserDto, UpdateRefreshTokenDto } from './dto';
import { HandleErrorService } from 'src/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { Repository, MoreThan } from 'typeorm';
import { RefreshToken, User } from './entities';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

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

  async getOne ( id: string ): Promise<User> {

    const user = await this.userRepository.findOne( { where: { id } } );

    if ( !user ) {
      this.handleErrorService.handleNotFoundException( 'User not found' );
    }
    return user;

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

    const userDb = await this.getOne( userId );

    const count = await this.refreshTokenRepository.count(
      { where: { user: userDb, token: refreshToken, expires: MoreThan( new Date ) } }
    );
    if ( count === 0 ) {
      this.handleErrorService.handleUnautorizedException( 'Invalid token' );
    }

    return await this.login( userDb, ip, true );

  }

}
