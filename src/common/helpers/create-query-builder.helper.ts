import { Repository } from "typeorm";
import { GetParams, GetResponse } from "../interfaces";

export async function createQueryBuilder<T> ( repository: Repository<T>, getProps: GetParams, alias: string ): Promise<GetResponse<T>> {

	const builder = repository.createQueryBuilder( alias );
	const getResponse: GetResponse<T> = {};

	if ( getProps.where && getProps.where.query ) {
		builder.where( getProps.where.query, getProps.where.params ? getProps.where.params : {} );
	}

	if ( getProps.andWhere && getProps.andWhere.length > 0 ) {
		for ( const and of getProps.andWhere ) {
			const type = typeof and.value;
			if ( type === 'boolean' ) {
				builder.andWhere( `${ alias }.${ and.field } = ${ and.value ? true : false }` );
			} else {
				builder.andWhere( `${ alias }.${ and.field } LIKE :s`, { s: `%${ and.value }%` } );
			}
		}
	}

	if ( getProps.orWhere && getProps.orWhere.length > 0 ) {
		for ( const or of getProps.orWhere ) {
			const type = typeof or.value;
			if ( type === 'boolean' ) {
				builder.orWhere( `${ alias }.${ or.field } = ${ or.value ? true : false }` );
			} else {
				builder.orWhere( `${ alias }.${ or.field } LIKE :s`, { s: `%${ or.value }%` } );
			}
		}
	}

	if ( getProps.sort && getProps.sort.column && getProps.sort.direction ) {
		const sortDirection = getProps.sort.direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
		builder.orderBy( `${ alias }.${ getProps.sort.column }`, sortDirection );
	}

	if ( getProps.page > 0 && getProps.limit > 0 ) {
		builder.offset( ( getProps.page - 1 ) * getProps.limit ).limit( getProps.limit );
		getResponse.total = await builder.getCount();
		getResponse.page = getProps.page;
		getResponse.lastPage = Math.ceil( getResponse.total / getProps.limit );
	}

	if ( getProps.select && getProps.select.length > 0 ) {
		builder.select( getProps.select.map( field => `${ alias }.${ field.trim() }` ) );
	}

	// Añadir soporte para relaciones
	if ( getProps.relations && getProps.relations.length > 0 ) {
		for ( const relation of getProps.relations ) {
			builder.leftJoinAndSelect( `${ alias }.${ relation }`, relation );
		}
	}

	getResponse.data = await builder.getMany();
	return getResponse;

}