import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './';
import { UserRoleGuard } from '../guards';

export { ValidRoles } from '../interfaces';

export function Auth ( ...roles: ValidRoles[] ) {

	return applyDecorators(
		RoleProtected( ...roles ),
		UseGuards( AuthGuard(), UserRoleGuard ),
	);

}