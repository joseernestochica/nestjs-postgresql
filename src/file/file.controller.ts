import { ConfigService } from '@nestjs/config';
import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException, Param, Get, Res } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';

import { FileService } from './file.service';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';

@ApiTags( 'Files - Get and Upload' )
@Controller( 'file' )
export class FileController {

  constructor (
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) { }

  @Get( 'product/:imageName' )
  getImageProduct (
    @Res() res: Response,
    @Param( 'imageName' ) imageName: string
  ) {

    const path = this.fileService.getStaticImage( imageName, 'products' );
    res.sendFile( path );

  }

  @Post( 'product/:id' )
  @UseInterceptors( FilesInterceptor( 'files', 10, {
    fileFilter: fileFilter,
    // limits: { fileSize: 1024 * 1024 },
    storage: diskStorage( {
      destination: ( req, file, callback ) => {
        const id = req.params.id;
        const directory = `./static/products/${ id }`;

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
  } ) )
  uploadProductFile ( @UploadedFiles() files: Array<Express.Multer.File>, @Param( 'id' ) id: string ) {

    return this.fileService.insertProductImages( id, files );

    // if ( !files || files.length === 0 ) { throw new BadRequestException( 'No se han proporcionado archivos o no son válidos' ); }

    // const secureUrls = files.map( file => {
    //   return `${ this.configService.get( 'HOST_API' ) }/file/product/${ file.filename }`;
    // } );

    // return { fileNames: secureUrls };

  }

}
