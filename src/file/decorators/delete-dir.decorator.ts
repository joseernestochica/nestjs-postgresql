import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { DeleteDirInterceptor } from '../interceptors/delete-dir.interceptor';

export function DeleteDir ( type: string ) {
	return applyDecorators(
		UseInterceptors( new DeleteDirInterceptor( type ) )
	);
} 