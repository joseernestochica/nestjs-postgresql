
export function stringToInt ( text: string | undefined ): number {

	if ( !text ) { return 0; }
	const convert = parseInt( text.trim(), 10 );
	if ( isNaN( convert ) ) { return 0; }

	return convert;

}