import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


export const RawHeaders = createParamDecorator(
	( data: unknown, ctx: ExecutionContext ) => {

		const request = ctx.switchToHttp().getRequest();
		const headers = request.rawHeaders || [];

		return headers;

	},
);