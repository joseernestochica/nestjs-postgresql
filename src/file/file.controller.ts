import { ConfigService } from '@nestjs/config';
import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException, Param, Get, Res, Delete, ParseUUIDPipe } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';

import { FileService } from './file.service';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { UploadDirFiles } from './decorators';
import { DeleteDir } from './decorators/delete-dir.decorator';

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
  @UploadDirFiles( 'products' )
  uploadProductFile ( @UploadedFiles() files: Array<Express.Multer.File>, @Param( 'id' ) id: string ) {
    return this.fileService.insertProductImages( id, files );
  }

  @Delete( 'product/:id' )
  @DeleteDir( 'products' )
  removeProductImages (
    @Param( 'id', ParseUUIDPipe ) productId: string
  ) {
    return this.fileService.removeProductImages( productId );
  }

}
