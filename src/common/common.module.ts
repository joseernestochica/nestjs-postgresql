import { Module } from '@nestjs/common';
import { HandleErrorService } from './services/handle-error.service';

@Module( {
  providers: [ HandleErrorService ],
  exports: [ HandleErrorService ]
} )
export class CommonModule { }
