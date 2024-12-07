import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


export const GetUser = createParamDecorator(
	( data: string[], ctx: ExecutionContext ) => {

		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		if ( data && data.length > 0 ) {
			const selectedUser = {};
			for ( const field of data ) {
				if ( user.hasOwnProperty( field ) ) {
					selectedUser[ field ] = user[ field ];
				}
			}
			return selectedUser;
		}


		if ( !user ) {
			throw new InternalServerErrorException( 'User not found (request)' );
		}

		return user;

	},
);