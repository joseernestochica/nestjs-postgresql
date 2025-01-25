import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { join } from 'path';
import { rm } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class DeleteDirInterceptor implements NestInterceptor {
	constructor (
		private readonly type: string
	) { }

	intercept ( context: ExecutionContext, next: CallHandler ): Observable<any> {
		return next.handle().pipe(
			tap( async () => {
				const request = context.switchToHttp().getRequest();
				const id = request.params.id;
				const path = join( __dirname, '..', '..', '..', 'static', this.type, id );

				if ( existsSync( path ) ) {
					await rm( path, { recursive: true, force: true } );
				}
			} )
		);
	}
} 