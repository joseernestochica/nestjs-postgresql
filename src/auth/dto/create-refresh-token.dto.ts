import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";


export class CreateRefreshTokenDto {

	@IsUUID()
	userId: string;

	@IsString()
	token: string;

	@IsDate()
	created: Date;

	@IsDate()
	expires: Date;

	@IsString()
	@IsOptional()
	ip?: string;

}