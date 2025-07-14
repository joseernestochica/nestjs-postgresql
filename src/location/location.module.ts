import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { HandleErrorService } from 'src/common/services';

@Module( {
  providers: [ LocationService, HandleErrorService ],
  controllers: [ LocationController ]
} )
export class LocationModule { }
