export interface GetParams {
	page?: number;
	limit?: number;
	where?: WhereParams;
	sort?: SortParams;
	select?: string[];
	search?: string;
	andWhere?: AndWhereParams[];
	orWhere?: AndWhereParams[];
	relations?: string[];
}

export interface WhereParams {
	query: string
	params?: any;
}

export interface SortParams {
	column: string,
	direction: string,
}

export interface AndWhereParams {
	field: string,
	value: any,
}