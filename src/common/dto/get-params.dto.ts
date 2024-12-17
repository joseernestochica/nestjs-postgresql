import { IsOptional, IsPositive, Min, IsString, IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetParamsDto {

	@ApiProperty( { required: false, default: 10, description: 'The number of items to return' } )
	@IsOptional()
	@IsPositive()
	@Type( () => Number )
	limit?: number;

	@ApiProperty( { required: false, default: 0, description: 'The number of items to skip before starting to collect the result set' } )
	@IsOptional()
	@Min( 1 )
	@Type( () => Number )
	page?: number;

	@ApiProperty( { required: false, default: 0, description: 'Params to search' } )
	@IsOptional()
	@IsString()
	select?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params to search' } )
	@IsOptional()
	@IsString()
	search?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params column to sort' } )
	@IsOptional()
	@IsString()
	sortColumn?: string;

	@ApiProperty( { required: false, default: 'DESC', description: 'Params direction to sort' } )
	@IsOptional()
	@IsIn( [ 'ASC', 'DESC' ] )
	sortDirection?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single string 1' } )
	@IsOptional()
	@IsString()
	sgStr1?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single string 2' } )
	@IsOptional()
	@IsString()
	sgStr2?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single string 3' } )
	@IsOptional()
	@IsString()
	sgStr3?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single string 4' } )
	@IsOptional()
	@IsString()
	sgStr4?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single string 5' } )
	@IsOptional()
	@IsString()
	sgStr5?: string;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single number 1' } )
	@IsOptional()
	@IsNumber()
	@Type( () => Number )
	sgInt1?: number;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single number 2' } )
	@IsOptional()
	@IsNumber()
	@Type( () => Number )
	sgInt2?: number;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single number 3' } )
	@IsOptional()
	@IsNumber()
	@Type( () => Number )
	sgInt3?: number;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single number 4' } )
	@IsOptional()
	@IsNumber()
	@Type( () => Number )
	sgInt4?: number;

	@ApiProperty( { required: false, default: 0, description: 'Params to search single number 5' } )
	@IsOptional()
	@IsNumber()
	@Type( () => Number )
	sgInt5?: number;

}