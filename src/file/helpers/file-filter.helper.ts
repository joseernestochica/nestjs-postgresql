import { Request } from 'express';

export const fileFilter = ( req: Request, file: Express.Multer.File, callback: Function ) => {

	if ( !file ) { return callback( new Error( 'File is empty' ), false ); }

	const allowedMimeTypes = [ 'image/jpeg', 'image/png' ];
	if ( !allowedMimeTypes.includes( file.mimetype ) ) {
		return callback( null, false );
	}

	callback( null, true );

};