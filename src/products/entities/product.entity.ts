
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { ProductImage } from './';
import { User } from 'src/auth/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity( {
	name: 'products'
} )
export class Product {

	@ApiProperty( { example: '7a721ee7-6dbd-40f6-9139-a87cb4def746', description: 'The unique identifier of the product', uniqueItems: true } )
	@PrimaryGeneratedColumn( 'uuid' )
	id: string;

	@ApiProperty( { example: 'Nike Air Max 90', description: 'The title of the product', uniqueItems: true } )
	@Column( 'text', { unique: true } )
	title: string;

	@ApiProperty( { example: 100.00, description: 'The price of the product' } )
	@Column( 'float', { default: 0 } ) // 10 digits in total, 2 after the decimal point
	price: number;

	@ApiProperty( { example: 'The best shoes in the world', description: 'The description of the product', default: null } )
	@Column( { type: 'text', nullable: true } )
	description: string;

	@ApiProperty( { example: 'nike-air-max-90', description: 'The slug of the product', uniqueItems: true } )
	@Column( 'text', { unique: true } )
	slug: string;

	@ApiProperty( { example: 10, description: 'The stock of the product' } )
	@Column( 'int', { default: 0 } )
	stock: number;

	@ApiProperty( { example: [ 'M', 'L', 'XL' ], description: 'The size of the product' } )
	@Column( 'text', { array: true } )
	sizes: string[];

	@ApiProperty( { example: 'men', description: 'Gender of product' } )
	@Column( 'text' )
	gender: string;

	@ApiProperty( { example: [ 'nike', 'shoes' ], description: 'The tags of the product' } )
	@Column( 'text', { array: true, default: [] } )
	tags: string[];

	@ApiProperty( { example: '2024-01-01T00:00:00Z', description: 'The creation date of the product' } )
	@Column( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' } )
	createdAt: Date;

	@ApiProperty( { example: '2024-01-01T00:00:00Z', description: 'The last update date of the product' } )
	@Column( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' } )
	updatedAt: Date;

	@ApiProperty( { example: [ 'image1.jpg', 'image2.jpg' ], description: 'Images of products' } )
	@OneToMany(
		() => ProductImage,
		( productImage ) => productImage.product,
		{ cascade: true, eager: true }
	)
	images: ProductImage[];

	@ManyToOne(
		() => User,
		( user ) => user.product,
		{ eager: true, onDelete: 'CASCADE' },
	)
	user: User;

	@BeforeInsert()
	checkSlug () {

		if ( !this.slug ) {
			this.slug = this.title;
		}

		this.slug = this.title.toLowerCase().replace( / /g, '-' );

	}

	@BeforeUpdate()
	checkSlugUpdate () {
		this.slug = this.title.toLowerCase().replace( / /g, '-' );
	}

}
