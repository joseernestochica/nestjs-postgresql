import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';
import { Auth, ValidRoles } from 'src/auth/decorators';

@ApiTags( 'Seed' )
@Controller( 'seed' )
export class SeedController {
  constructor ( private readonly seedService: SeedService ) { }

  @Get()
  // @Auth( ValidRoles.admin )
  executeSeed () {
    return this.seedService.runSeed();
  }

}
