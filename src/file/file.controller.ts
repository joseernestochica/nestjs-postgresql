import { Controller, Post, UploadedFiles, Param, Get, Res, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

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

  @Get( 'product/:imageName/:id' )
  getImageProduct (
    @Res() res: Response,
    @Param( 'imageName' ) imageName: string,
    @Param( 'id' ) id: string
  ) {

    const path = this.fileService.getStaticImage( imageName, 'products', id );
    res.sendFile( path );

  }

  @Get( 'user/:imageName/:id' )
  getImageUser (
    @Res() res: Response,
    @Param( 'imageName' ) imageName: string,
    @Param( 'id' ) id: string
  ) {

    const path = this.fileService.getStaticImage( imageName, 'users', id );
    res.sendFile( path );

  }

  @Post( 'product/:id' )
  @Auth( ValidRoles.user, ValidRoles.superUser, ValidRoles.admin )
  @UploadDirFiles( 'products' )
  uploadProductFile ( @UploadedFiles() files: Array<Express.Multer.File>, @Param( 'id' ) id: string ) {
    return this.fileService.insertProductImages( id, files );
  }

  @Delete( 'product/:id' )
  @Auth( ValidRoles.user, ValidRoles.superUser, ValidRoles.admin )
  @DeleteDir( 'products' )
  removeProductImages (
    @Param( 'id', ParseUUIDPipe ) productId: string
  ) {
    return this.fileService.removeProductImages( productId );
  }

  @Post( 'user/:id' )
  @Auth( ValidRoles.user, ValidRoles.superUser, ValidRoles.admin )
  @UploadDirFiles( 'users' )
  uploadUserFile ( @UploadedFiles() files: Array<Express.Multer.File>, @Param( 'id' ) id: string ) {
    return this.fileService.insertUserImages( id, files );
  }

  @Delete( 'user/:id' )
  @Auth( ValidRoles.user, ValidRoles.superUser, ValidRoles.admin )
  @DeleteDir( 'users' )
  removeUserImages ( @Param( 'id' ) id: string ) {
    return this.fileService.removeUserImages( id );
  }

}
