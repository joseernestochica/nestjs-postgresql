
export interface GetProps {
	page?: number;
	limit?: number;
	where?: WhereProps;
	sort?: SortProps;
	select?: string[];
	search?: string;
	andWhere?: AndWhereProps[];
	orWhere?: AndWhereProps[];
}

export interface WhereProps {
	query: string
	params?: any;
}

export interface SortProps {
	column: string,
	direction: "ASC" | "DESC"
}

export interface AndWhereProps {
	field: string,
	value: any,
}