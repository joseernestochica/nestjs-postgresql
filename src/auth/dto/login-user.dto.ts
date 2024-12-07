import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';


export class LoginUserDto {

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

}