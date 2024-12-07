import { join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FileService {

	getStaticImage ( imageName: string, type: string ): string {

		const path = join( __dirname, '..', '..', 'static', type, imageName );

		if ( !existsSync( path ) ) {
			throw new BadRequestException( `Image not found` );
		}

		return path;

	}

}
