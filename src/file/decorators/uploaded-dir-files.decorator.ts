import { UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { fileFilter, fileNamer } from '../helpers';

export function UploadDirFiles ( folder: string, maxFiles: number = 10 ) {
	return UseInterceptors(
		FilesInterceptor( 'files', maxFiles, {
			fileFilter: fileFilter,
			// limits: { fileSize: 1024 * 1024 },
			storage: diskStorage( {
				destination: ( req, file, callback ) => {
					const id = req.params.id;
					const directory = `./static/${ folder }/${ id }`;

					// Eliminar directorio si existe
					if ( fs.existsSync( directory ) ) {
						fs.rmSync( directory, { recursive: true } );
					}

					// Crear nuevo directorio
					fs.mkdirSync( directory, { recursive: true } );

					callback( null, directory );
				},
				filename: fileNamer,
			} )
		} )
	);
}