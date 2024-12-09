import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HandleErrorService } from 'src/common/services';
import { JwtStrategy } from './strategies';
import { RefreshToken, User } from './entities';

@Module( {
  controllers: [ AuthController ],
  providers: [ AuthService, HandleErrorService, JwtStrategy ],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature( [ User, RefreshToken ] ),
    PassportModule.register( {
      defaultStrategy: 'jwt'
    } ),
    JwtModule.registerAsync( {
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ( {
        secret: configService.get( 'JWT_SECRET' ),
        signOptions: { expiresIn: configService.get( 'JWT_EXPIRES_IN' ) }
      } )
    } )
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
} )
export class AuthModule { }
