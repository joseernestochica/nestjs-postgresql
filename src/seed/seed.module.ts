import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module( {
  controllers: [ SeedController ],
  providers: [ SeedService ],
  imports: [
    ProductsModule,
    AuthModule
  ],
} )
export class SeedModule { }
