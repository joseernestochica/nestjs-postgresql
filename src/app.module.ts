import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { MessageWsModule } from './message-ws/message-ws.module';
import { LocationModule } from './location/location.module';

@Module( {
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot( {
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
          ? { rejectUnauthorized: false }
          : null
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt( process.env.DB_PORT, 10 ) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    } ),
    ServeStaticModule.forRoot( {
      rootPath: join( __dirname, '..', 'public' ),
    } ),
    ProductsModule,
    CommonModule,
    SeedModule,
    FileModule,
    AuthModule,
    MessageWsModule,
    LocationModule
  ],
} )
export class AppModule { }


