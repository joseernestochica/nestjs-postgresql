import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ConfigService } from '@nestjs/config';

@Module( {
  controllers: [ FileController ],
  providers: [ FileService, ConfigService ],
} )
export class FileModule { }
