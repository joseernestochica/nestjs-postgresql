import { CreateProductDto, UpdateProductDto } from './dto';
import { Injectable, InternalServerErrorException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { Repository, DataSource } from 'typeorm';
import { PaginationDto } from 'src/common/dto';
import { validate as isUUID } from 'uuid';
import { HandleErrorService } from 'src/common/services';
import { User } from 'src/auth/entities';


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

  async create ( createProductDto: CreateProductDto, user: User ) {

    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create( {
        ...productDetails,
        images: images.map( image => this.productImageRepository.create( { url: image } ) ),
        user
      } );

      await this.productRepository.save( product );

      return { ...product, images };

    }
    catch ( error ) {
      this.handleErrorService.handleDBException( error );
    }

  }

  async findAll ( paginationDto: PaginationDto ) {

    try {

      const { limit = 10, offset = 0 } = paginationDto;

      const products = await this.productRepository.find( {
        take: limit,
        skip: offset,
        relations: [ 'images' ]
      } );

      return products.map( product => ( { ...product, images: product.images.map( image => image.url ) } ) );

    }
    catch ( error ) {
      this.handleErrorService.handleDBException( error );
    }

  }

  async findOne ( term: string ) {

    let product: Product;

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOneBy( { id: term } );
    }
    else {
      const query = this.productRepository.createQueryBuilder( 'product' ); // alias is 'product'
      product = await query
        .where( 'LOWER(title) = LOWER(:title) OR slug =:title ', { title: term } )
        .leftJoinAndSelect( 'product.images', 'productImages' ) // alias is 'productImages'
        .getOne();
    }

    if ( !product ) {
      this.handleErrorService.handleNotFoundException( `Product with id ${ term } not found` );
    }

    return product;

  }

  async findOnePlain ( term: string ) {

    const { images = [], ...product } = await this.findOne( term );
    return { ...product, images: images.map( image => image.url ) };

  }

  async update ( id: string, updateProductDto: UpdateProductDto, user: User ) {

    const { images, ...productToUpdate } = updateProductDto;

    const product = await this.productRepository.preload( { id, ...productToUpdate } );

    if ( !product ) {
      throw new NotFoundException( `Product with id ${ id } not found` );
    }

    // Crear el query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      if ( images ) {

        await queryRunner.manager.delete( ProductImage, { product: id } );
        product.images = images.map( image => this.productImageRepository.create( { url: image } ) );

      }

      product.user = user;
      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id );

    } catch ( error ) {
      await queryRunner.rollbackTransaction(); // Deshacer los cambios
      this.handleErrorService.handleDBException( error );
    }

  }

  async remove ( id: string ) {

    const product = await this.findOne( id );

    await this.productRepository.remove( product );
    return product;


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
