import { Repository } from "typeorm";
import { GetProps } from "../interfaces/get-props.interface";
import { GetResponse } from "../interfaces/get-response.interface";

export async function createQueryBuilder<T> ( repository: Repository<T>, getProps: GetProps, alias: string ): Promise<GetResponse<T>> {

	const builder = repository.createQueryBuilder( alias );
	const getResponse: GetResponse<T> = {};

	if ( getProps.where && getProps.where.query ) {
		builder.where( getProps.where.query, getProps.where.params ? getProps.where.params : {} );
	}

	if ( getProps.andWhere && getProps.andWhere.length > 0 ) {
		for ( const and of getProps.andWhere ) {
			builder.andWhere( `${ alias }.${ and.field } LIKE :s`, { s: `%${ and.value }%` } );
		}
	}

	if ( getProps.orWhere && getProps.orWhere.length > 0 ) {
		for ( const or of getProps.orWhere ) {
			builder.orWhere( `${ alias }.${ or.field } LIKE :s`, { s: `%${ or.value }%` } );
		}
	}

	if ( getProps.sort && getProps.sort.column && getProps.sort.direction ) {
		builder.orderBy( `${ alias }.${ getProps.sort.column }`, getProps.sort.direction );
	}

	if ( getProps.page > 0 && getProps.limit > 0 ) {
		builder.offset( ( getProps.page - 1 ) * getProps.limit ).limit( getProps.limit );
		getResponse.total = await builder.getCount();
		getResponse.page = getProps.page;
		getResponse.last_page = Math.ceil( getResponse.total / getProps.limit );
	}

	if ( getProps.select && getProps.select.length > 0 ) {
		builder.select( getProps.select.map( field => `${ alias }.${ field.trim() }` ) );
	}

	getResponse.data = await builder.getMany();
	return getResponse;

}