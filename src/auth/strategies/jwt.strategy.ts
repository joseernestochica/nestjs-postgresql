
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';

import { HandleErrorService } from '../../common/services/handle-error.service';
import { JwtPayload } from '../interfaces';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

	constructor (
		@InjectRepository( User )
		private readonly userRepository: Repository<User>,
		private readonly configService: ConfigService,
		private readonly handleErrorService: HandleErrorService
	) {
		super( {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get( 'JWT_SECRET' )
		} )
	}

	async validate ( payload: JwtPayload ): Promise<User> {

		const { id } = payload;

		const user = await this.userRepository.findOneBy( { id } );
		if ( !user ) {
			this.handleErrorService.handleUnautorizedException( 'Token not valid' );
		}

		if ( !user.isActive ) {
			this.handleErrorService.handleUnautorizedException( 'User is not active' );
		}

		return user;

	}

}
