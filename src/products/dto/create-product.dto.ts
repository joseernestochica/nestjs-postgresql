import { IsString, IsNumber, IsOptional, IsArray, IsIn, MinLength, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

	@ApiProperty( { example: 'Nike Air Max 90', description: 'The title of the product', nullable: false, minLength: 1 } )
	@IsString()
	@MinLength( 1 )
	title: string;

	@ApiProperty( { example: 100.00, description: 'The price of the product', nullable: true, default: 0 } )
	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number;

	@ApiProperty( { example: 'The best shoes in the world', description: 'The description of the product', nullable: true } )
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty( { example: 'nike-air-max-90', description: 'The slug of the product', nullable: true } )
	@IsString()
	@IsOptional()
	slug?: string;

	@ApiProperty( { example: 10, description: 'The stock of the product', nullable: true, default: 0 } )
	@IsInt()
	@IsOptional()
	@IsPositive()
	stock?: number;

	@ApiProperty( { example: [ 'M', 'L', 'XL' ], description: 'The size of the product', nullable: false, uniqueItems: true } )
	@IsArray()
	@IsString( { each: true } )
	sizes: string[];

	@ApiProperty( { example: [ 'nike', 'shoes' ], description: 'The tags of the product', nullable: true } )
	@IsArray()
	@IsString( { each: true } )
	@IsOptional()
	tags?: string[];

	@ApiProperty( { example: [ 'image1.jpg', 'image2.jpg' ], description: 'Images of products', nullable: true } )
	@IsArray()
	@IsString( { each: true } )
	@IsOptional()
	images?: string[];

	@ApiProperty( { example: [ 'men' ], description: 'gneer of product', nullable: false } )
	@IsIn( [ 'men', 'women', 'kid', 'unisex' ] )
	gender: string;

}
