import { HandleErrorService } from 'src/common/services';
import { join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities';

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

		// product.images = files.map( file => file.filename );

		await this.productRepository.save( product );

		return {
			message: 'Imágenes guardadas correctamente',
			images: product.images
		};

	}

}
