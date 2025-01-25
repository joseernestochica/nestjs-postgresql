import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products';
import { CommonModule } from 'src/common/common.module';

@Module( {
  imports: [
    ProductsModule,
    CommonModule
  ],
  controllers: [ FileController ],
  providers: [ FileService, ConfigService ],
} )
export class FileModule { }
