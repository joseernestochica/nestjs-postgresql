import { ConfigService } from '@nestjs/config';
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Param, Get, Res } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

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

  @Post( 'product' )
  @UseInterceptors( FileInterceptor( 'file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1024 * 1024 },
    storage: diskStorage( {
      destination: './static/products',
      filename: fileNamer,
    } )
  } ) )
  uploadProductFile ( @UploadedFile() file: Express.Multer.File ) {

    if ( !file ) { throw new BadRequestException( `File not permited o invalid` ); }

    const secureUrl = `${ this.configService.get( 'HOST_API' ) }/file/product/${ file.filename }`;

    return { fileName: secureUrl };

  }

}
