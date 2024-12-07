import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class HandleErrorService {

	private logger = new Logger( 'CommonHandleErrorService' );

	handleDBException ( error: any ): void {
		if ( error.code === '23505' ) {
			throw new BadRequestException( error.detail );
		}

		this.logger.error( error.message );
		throw new InternalServerErrorException( 'Check server logs' );

	}

	handleNotFoundException ( message: string ): void {
		throw new NotFoundException( message );
	}

	handleBadRequestException ( message: string ): void {
		throw new BadRequestException( message );
	}

	handleUnautorizedException ( message: string ): void {
		throw new UnauthorizedException( message );
	}

}
