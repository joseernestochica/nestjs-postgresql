import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { HandleErrorService } from 'src/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor (
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private readonly handleErrorService: HandleErrorService,
    private readonly jwtService: JwtService
  ) { }

  private getJwtToken ( payload: JwtPayload ): string {

    return this.jwtService.sign( payload );

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

  async login ( loginUserDto: LoginUserDto ) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne( {
      where: { email },
      select: [ 'id', 'password' ]
    } );

    if ( !user ) {
      this.handleErrorService.handleUnautorizedException( 'User not found (email)' );
    }

    if ( !bcrypt.compareSync( password, user.password ) ) {
      this.handleErrorService.handleUnautorizedException( 'Invalid password' );
    }

    return {
      ...user,
      token: this.getJwtToken( { id: user.id } )
    };

  }

  async checkAuthStatus ( user: User ) {

    return {
      ...user,
      token: this.getJwtToken( { id: user.id } )
    };

  }

}
