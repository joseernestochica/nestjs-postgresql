import { extname } from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const fileNamer = ( req: Request, file: Express.Multer.File, callback: Function ) => {

	const fileExtension = extname( file.originalname );
	const fileName = `${ uuidv4() }${ fileExtension }`;

	callback( null, fileName );

};