import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ProductsService, ProductsController, Product, ProductImage } from './';
import { HandleErrorService } from 'src/common/services';

@Module( {
  controllers: [ ProductsController ],
  providers: [ ProductsService, HandleErrorService ],
  imports: [
    TypeOrmModule.forFeature( [ Product, ProductImage ] ),
    CommonModule,
    AuthModule
  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
} )
export class ProductsModule { }


