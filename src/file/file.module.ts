import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ConfigService } from '@nestjs/config';
import { ProductsModule } from 'src/products';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module( {
  imports: [
    ProductsModule,
    CommonModule,
    AuthModule
  ],
  controllers: [ FileController ],
  providers: [ FileService, ConfigService ],
} )
export class FileModule { }
