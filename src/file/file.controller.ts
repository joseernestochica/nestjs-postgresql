import { Controller, Post, UploadedFiles, Param, Get, Res, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FileService } from './file.service';
import { Response } from 'express';
import { UploadDirFiles } from './decorators';
import { DeleteDir } from './decorators/delete-dir.decorator';

@ApiTags( 'Files - Get and Upload' )
@Controller( 'file' )
export class FileController {

  constructor (
    private readonly fileService: FileService,
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

  @Post( 'user/:id' )
  @UploadDirFiles( 'users' )
  uploadUserFile ( @UploadedFiles() files: Array<Express.Multer.File>, @Param( 'id' ) id: string ) {
    return this.fileService.insertUserImages( id, files );
  }

  @Delete( 'user/:id' )
  @DeleteDir( 'users' )
  removeUserImages ( @Param( 'id' ) id: string ) {
    return this.fileService.removeUserImages( id );
  }

}
