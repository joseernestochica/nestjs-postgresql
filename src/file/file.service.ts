import { HandleErrorService } from 'src/common/services';
import { join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductImage } from '../products/entities';
import { unlink } from 'fs/promises';

@Injectable()
export class FileService {

	constructor (
		private readonly handleErrorService: HandleErrorService,
		@InjectRepository( Product )
		private readonly productRepository: Repository<Product>
	) { }

	getStaticImage ( imageName: string, type: string ): string {

		const path = join( __dirname, '..', '..', 'static', type, imageName );

		if ( !existsSync( path ) ) {
			throw new BadRequestException( `Image not found` );
		}

		return path;

	}

	async insertProductImages ( productId: string, files: Express.Multer.File[] ) {

		if ( !files || files.length === 0 ) { this.handleErrorService.handleBadRequestException( `Images not found` ); }

		const product = await this.productRepository.findOneBy( { id: productId } );
		if ( !product ) { this.handleErrorService.handleBadRequestException( `Product not found` ); }

		const images = files.map( file => ( {
			url: file.filename,
			product: { id: productId }
		} ) as ProductImage );

		product.images = images;
		await this.productRepository.save( product );

		return {
			message: 'Imágenes guardadas correctamente',
			data: images.map( image => ( {
				url: image.url
			} ) )
		};

	}

	async removeProductImages ( productId: string ) {

		const product = await this.productRepository.findOneBy( { id: productId } );

		if ( !product ) {
			this.handleErrorService.handleBadRequestException( `Product not found` );
		}

		// Eliminar registros de la base de datos
		product.images = [];
		await this.productRepository.save( product );

		return {
			message: 'Imágenes eliminadas correctamente'
		};

	}

}
