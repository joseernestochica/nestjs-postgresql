import { PartialType } from '@nestjs/swagger';
import { IsUUID } from "class-validator";
import { CreateRefreshTokenDto } from './';


export class UpdateRefreshTokenDto extends PartialType( CreateRefreshTokenDto ) {

	@IsUUID()
	refreshToken: string;

}