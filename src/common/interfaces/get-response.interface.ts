
export interface GetResponse<T> {

	data?: T[];
	total?: number;
	page?: number;
	last_page?: number;

}