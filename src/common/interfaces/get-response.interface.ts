
export interface GetResponse<T> {

	data?: T[] | T;
	total?: number;
	page?: number;
	lastPage?: number;
	message?: string;
	statusCode?: number;
	token?: string;
	refreshToken?: string;

}