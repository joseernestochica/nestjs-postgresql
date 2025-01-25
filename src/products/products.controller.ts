import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { Auth, GetUser, ValidRoles } from 'src/auth/decorators';
import { CreateProductDto, UpdateProductDto } from './dto';
import { GetParamsDto } from 'src/common/dto';
import { Product } from './entities';
import { ProductsService } from './products.service';
import { User } from 'src/auth/entities';

@ApiTags( 'Products' )
@Controller( 'products' )
export class ProductsController {
  constructor ( private readonly productsService: ProductsService ) { }

  @Post()
  @Auth()
  @ApiResponse( { status: 201, description: 'Product created', type: Product } )
  @ApiResponse( { status: 400, description: 'Bad resquest' } )
  @ApiResponse( { status: 403, description: 'Forbiden. Token incorrect' } )
  create (
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create( createProductDto, user );
  }

  @Get()
  findAll ( @Query() getParamsDto: GetParamsDto ) {
    return this.productsService.findAll( getParamsDto );
  }

  @Get( ':term' )
  findOne ( @Param( 'term' ) term: string ) {
    return this.productsService.findOne( term );
  }

  @Patch( ':id' )
  @Auth()
  update (
    @Param( 'id', ParseUUIDPipe ) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update( id, updateProductDto, user );
  }

  @Delete( ':id' )
  @Auth( ValidRoles.admin )
  remove ( @Param( 'id', ParseUUIDPipe ) id: string ) {
    return this.productsService.remove( id );
  }
}
