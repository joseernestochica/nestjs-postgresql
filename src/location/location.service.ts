import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city/lib/interface';
import * as i18nIsoCountries from 'i18n-iso-countries';
import { getProvinces, getCities } from 'spanishcities';
import { Utils } from 'src/common/helpers';
import { StateInterface } from 'src/location/interfaces';
import { GetResponse } from 'src/common/interfaces';
import { HandleErrorService } from 'src/common/services';

@Injectable()
export class LocationService {

	constructor (
		private readonly handleErrorService: HandleErrorService
	) { }

	getCountryByCode ( country: string | undefined, lang = 'es' ): GetResponse<string> {

		try {

			if ( !country ) { throw ( 'Country is required' ) }

			i18nIsoCountries.registerLocale( require( `i18n-iso-countries/langs/${ lang }.json` ) );
			return {
				data: i18nIsoCountries.getName( country, lang ),
				statusCode: 200,
				message: 'Country fetched successfully'
			};

		} catch ( error ) {
			this.handleErrorService.handleBadRequestException( error );
		}

	}

	getStatebyCode ( country: string | undefined, state: string | undefined ): GetResponse<string> {

		try {

			if ( !country || !state ) { throw ( 'Country and state are required' ) }

			country = country.toUpperCase();
			state = state.toUpperCase();

			if ( state === 'no-value' ) {
				return this.getCountryByCode( country );
			}

			if ( country === 'ES' ) {

				const statesEs: any[] = getProvinces();
				if ( !statesEs || statesEs.length === 0 ) {
					return {
						data: '',
						statusCode: 200,
						message: 'State by code not found'
					};
				}

				for ( const stateEs of statesEs ) {
					if ( stateEs.code === state )
						return {
							data: Utils.capitalize( stateEs.name ),
							statusCode: 200,
							message: 'State by code found'
						};
				}

			} else {
				return {
					data: State.getStateByCodeAndCountry( state, country )?.name || '',
					statusCode: 200,
					message: 'State by code found'
				};
			}

			return {
				data: '',
				statusCode: 200,
				message: 'State by code not found'
			};

		} catch ( error ) {
			this.handleErrorService.handleBadRequestException( error );
		}

	}

	getCitiesByCountryAndState ( country: string, state: string ): GetResponse<StateInterface[]> {

		try {

			let cities: StateInterface[] = [];

			if ( !country || country === '' || !state || state === '' ) {
				throw ( 'Country and state are required' )
			}

			if ( state === 'no-value' ) {
				cities = [ { id: 'no-value', name: this.getCountryByCode( country ).data as string } ];
			}

			country = country.toUpperCase();
			state = state.toUpperCase();

			if ( country === 'ES' ) {

				const citiesEs: any[] = getCities( state );
				if ( !citiesEs || citiesEs.length === 0 ) {
					return {
						data: [],
						statusCode: 200,
						message: 'Cities by country and state not found'
					};
				};

				for ( const cityEs of citiesEs ) {
					cities.push( { id: Utils.formatUrlString( cityEs ), name: cityEs } );
				}

			} else {

				const citiesAll: ICity[] = City.getCitiesOfState( country, state );

				if ( !citiesAll || citiesAll.length === 0 ) {
					cities = [ { id: 'no-value', name: this.getStatebyCode( country, state ).data as string } ];
				}

				for ( const city of citiesAll ) {
					cities.push( { id: Utils.formatUrlString( city.name ), name: city.name } );
				}
			}

			return {
				data: cities,
				statusCode: 200,
				message: 'Cities by country and state fetched successfully'
			};

		} catch ( error ) {
			this.handleErrorService.handleBadRequestException( error );
		}

	}

	getAllCountries ( lang?: string ): GetResponse<ICountry[]> {

		try {

			const countriesEn = Country.getAllCountries();
			let countries: ICountry[] = countriesEn;

			i18nIsoCountries.registerLocale( require( `i18n-iso-countries/langs/${ lang ? lang : 'es' }.json` ) );
			countries.map( country => country.name = i18nIsoCountries.getName( country.isoCode, lang ? lang : 'es' ) );

			return {
				data: countries.sort( ( a, b ) => ( a.name > b.name ) ? 1 : ( ( b.name > a.name ) ? -1 : 0 ) ),
				statusCode: 200,
				message: 'Countries fetched successfully'
			};

		} catch ( error ) {
			this.handleErrorService.handleBadRequestException( error );
		}

	}

	getStatesByCountry ( countryIso: string ): GetResponse<StateInterface[]> {

		try {

			let states: StateInterface[] = [];

			if ( countryIso === 'ES' ) {

				const statesEs: any[] = getProvinces();
				if ( !statesEs || statesEs.length === 0 ) {
					return {
						data: [],
						statusCode: 200,
						message: 'States fetched successfully'
					};
				}
				statesEs.forEach( state => states.push( { id: state.code, name: Utils.capitalize( state.name ) } ) );

			} else {

				const statesAll: IState[] = State.getStatesOfCountry( countryIso );
				if ( !statesAll || statesAll.length === 0 ) {
					states = [ { id: 'no-value', name: this.getCountryByCode( countryIso ).data as string } ];
				}

				statesAll.forEach( state => states.push( { id: state.isoCode, name: state.name } ) );

			}

			return {
				data: states,
				statusCode: 200,
				message: 'States fetched successfully'
			};

		} catch ( error ) {
			this.handleErrorService.handleBadRequestException( error );
		}

	}

	getCityByCode ( country: string | undefined, state: string | undefined, city: string | undefined ): GetResponse<string> {

		try {

			if ( !country || !state || !city ) {
				throw ( 'Country, state and city are required' );
			}

			country = country.toUpperCase();
			state = state.toUpperCase();

			const cities = this.getCitiesByCountryAndState( country, state );

			if ( !cities || cities.data.length === 0 ) {
				return {
					data: '',
					statusCode: 200,
					message: 'City by code not found'
				};
			};

			for ( const cityArr of cities.data as StateInterface[] ) {
				if ( Utils.formatUrlString( city ) === Utils.formatUrlString( cityArr.id ) ) {
					return {
						data: cityArr.name,
						statusCode: 200,
						message: 'City by code found'
					};
				}
			}

			return {
				data: '',
				statusCode: 200,
				message: 'City by code not found'
			};

		} catch ( error ) {
			this.handleErrorService.handleBadRequestException( error );
		}

	}

}
