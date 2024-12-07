import { Module } from '@nestjs/common';
import { HandleErrorService } from './services';

@Module( {
  providers: [ HandleErrorService ],
  exports: [ CommonModule ]
} )
export class CommonModule { }
