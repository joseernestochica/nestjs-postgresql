import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';


export class CreateUserDto {

	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	@IsString()
	@MinLength( 6 )
	@MaxLength( 50 )
	@Matches(
		/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number'
	} )
	password: string;

	@IsString()
	@IsNotEmpty()
	readonly fullName: string;

	@IsString()
	@IsOptional()
	readonly phone?: string;

	@IsString()
	@IsOptional()
	readonly address?: string;

	@IsString()
	@IsOptional()
	readonly postalCode?: string;

	@IsString()
	@IsOptional()
	readonly city?: string;

	@IsString()
	@IsOptional()
	readonly province?: string;

	@IsString()
	@IsOptional()
	readonly country?: string;

	@IsString()
	@IsOptional()
	readonly nif?: string;

}