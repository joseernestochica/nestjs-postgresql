import { CreateProductDto, UpdateProductDto } from './dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { Repository, DataSource } from 'typeorm';
import { GetParamsDto } from 'src/common/dto';
import { validate as isUUID } from 'uuid';
import { HandleErrorService } from 'src/common/services';
import { User } from 'src/auth/entities';
import { GetParams, GetResponse } from 'src/common/interfaces';
import { createQueryBuilder } from 'src/common/helpers';


@Injectable()
export class ProductsService {

  private logger = new Logger( 'ProductsService' );

  constructor (
    @InjectRepository( Product )
    private readonly productRepository: Repository<Product>,
    @InjectRepository( ProductImage )
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly handleErrorService: HandleErrorService
  ) { }

  async create ( createProductDto: CreateProductDto, user: User ): Promise<GetResponse<Partial<Product>>> {

    try {

      const productDetails = createProductDto;

      const product = this.productRepository.create( {
        ...productDetails,
        user
      } );

      await this.productRepository.save( product );
      const { user: _, ...rest } = product;

      return {
        data: rest,
        message: 'Product created',
        statusCode: 201
      };

    }
    catch ( error ) {
      this.handleErrorService.handleDBException( error );
    }

  }

  async findAll ( getParamsDto: GetParamsDto ): Promise<GetResponse<Product>> {

    try {

      const getParams: GetParams = {};
      getParams.page = getParamsDto.page || 1;
      getParams.limit = getParamsDto.limit || 10;
      getParams.sort = { column: getParamsDto.sortColumn || 'id', direction: getParamsDto.sortDirection || 'DESC' };
      getParams.select = getParamsDto.select && getParamsDto.select !== '' ? getParamsDto.select.split( '|' ) : [];
      getParams.search = getParamsDto.search && getParamsDto.search.trim() !== '' ? getParamsDto.search.trim() : undefined;

      if ( getParams.search ) {
        getParams.where = {
          query: `product.title LIKE :s 
          OR product.slug LIKE :s`,
          params: {
            s: `%${ getParams.search }%`,
          }
        };
      }

      // Agregamos la relación de imágenes
      getParams.relations = [ 'images' ];

      const getResponse = await createQueryBuilder<Product>( this.productRepository, getParams, 'product' );
      if ( !getResponse || ( getResponse.data as Product[] ).length === 0 ) {
        this.handleErrorService.handleNotFoundException( 'Products not found' );
      }


      getResponse.message = 'Products list';
      getResponse.statusCode = 200;

      return getResponse;

    }
    catch ( error ) {
      this.handleErrorService.handleDBException( error );
    }

  }

  async findOne ( term: string ): Promise<GetResponse<Product>> {

    let product: Product;

    if ( isUUID( term ) ) {
      product = await this.productRepository.createQueryBuilder( 'product' )
        .leftJoinAndSelect( 'product.images', 'productImages' )
        .leftJoinAndSelect( 'product.user', 'user' )
        .select( [ 'product', 'productImages.url', 'user.id', 'user.email' ] )
        .where( 'product.id = :id', { id: term } )
        .getOne();
    }
    else {
      const query = this.productRepository.createQueryBuilder( 'product' ); // alias is 'product'
      product = await query
        .where( 'LOWER(title) = LOWER(:title) OR slug =:title ', { title: term } )
        .leftJoinAndSelect( 'product.images', 'productImages' ) // alias is 'productImages'
        .leftJoinAndSelect( 'product.user', 'user' )
        .select( [ 'product', 'productImages.url', 'user.id', 'user.email' ] )
        .getOne();
    }

    if ( !product ) {
      this.handleErrorService.handleNotFoundException( `Product with id ${ term } not found` );
    }

    return {
      data: product,
      message: 'Product found',
      statusCode: 200
    };

  }

  async update ( id: string, updateProductDto: UpdateProductDto, user: User ): Promise<GetResponse<Partial<Product>>> {

    const productToUpdate = updateProductDto;

    const product = await this.productRepository.preload( { id, ...productToUpdate } );

    if ( !product ) {
      throw new NotFoundException( `Product with id ${ id } not found` );
    }

    // Crear el query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      product.user = user;
      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      const { user: _, ...rest } = product;

      return {
        data: rest,
        message: 'Product updated',
        statusCode: 200
      };

    } catch ( error ) {
      await queryRunner.rollbackTransaction(); // Deshacer los cambios
      this.handleErrorService.handleDBException( error );
    }

  }

  async remove ( id: string ) {

    const { data } = await this.findOne( id );
    const product = data as Product;  // Asegurar que es un Product

    await this.productRepository.remove( product );

    return {
      data: product,
      message: 'Product deleted',
      statusCode: 200
    };
  }

  async removeAllProducts () {

    const query = this.productRepository.createQueryBuilder( 'product' );

    try {

      return await query.delete().where( {} ).execute();

    }
    catch ( error ) {
      this.handleErrorService.handleDBException( error );
    }

  }

}
