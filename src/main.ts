import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap () {

  const app = await NestFactory.create( AppModule );
  const logger = new Logger( 'Bootstrap' );

  app.setGlobalPrefix( 'api' );

  app.useGlobalPipes(
    new ValidationPipe( {
      whitelist: true,
      forbidNonWhitelisted: true,
    } )
  );

  const config = new DocumentBuilder()
    .setTitle( 'Contenedor Nest - PostgreSQL' )
    .setDescription( 'Contenedor a partir de cual generar Backend con Nest y PostgreSQL' )
    .setVersion( '1.0' )
    .build();
  const documentFactory = () => SwaggerModule.createDocument( app, config );
  SwaggerModule.setup( 'api', app, documentFactory );

  await app.listen( process.env.PORT || 3000 );
  logger.log( `Application is running in port: ${ process.env.PORT }` );

}
bootstrap();
