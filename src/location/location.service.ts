import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city/lib/interface';
import * as i18nIsoCountries from 'i18n-iso-countries';
import { getProvinces, getCities } from 'spanishcities';
import { Utils } from 'src/common/helpers';
import { StateInterface } from 'src/location/interfaces';

@Injectable()
export class LocationService {

	getCountryByCode ( country: string | undefined, lang = 'es' ): string | any {

		try {

			if ( !country ) { return '' }

			i18nIsoCountries.registerLocale( require( `i18n-iso-countries/langs/${ lang }.json` ) );
			return i18nIsoCountries.getName( country, lang );

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

	getStatebyCode ( country: string | undefined, state: string | undefined ): string | any {

		try {

			if ( !country || !state ) { return '' }
			country = country.toUpperCase();
			state = state.toUpperCase();

			if ( state === 'no-value' ) {
				return this.getCountryByCode( country );
			}

			if ( country === 'ES' ) {

				const statesEs: any[] = getProvinces();
				if ( !statesEs || statesEs.length === 0 ) return '';

				for ( const stateEs of statesEs ) {
					if ( stateEs.code === state )
						return Utils.capitalize( stateEs.name );
				}

			} else {
				return State.getStateByCodeAndCountry( state, country )?.name || '';
			}

			return '';

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

	getCitiesByCountryAndState ( country: string, state: string ): StateInterface[] | any {

		try {

			let cities: StateInterface[] = [];

			if ( !country || country === '' || !state || state === '' ) {
				return cities;
			}

			if ( state === 'no-value' ) {
				cities = [ { id: 'no-value', name: this.getCountryByCode( country ) } ];
			}

			country = country.toUpperCase();
			state = state.toUpperCase();

			if ( country === 'ES' ) {

				const citiesEs: any[] = getCities( state );
				if ( !citiesEs || citiesEs.length === 0 ) {
					return cities;
				};

				for ( const cityEs of citiesEs ) {
					cities.push( { id: Utils.formatUrlString( cityEs ), name: cityEs } );
				}

			} else {

				const citiesAll: ICity[] = City.getCitiesOfState( country, state );

				if ( !citiesAll || citiesAll.length === 0 ) {
					cities = [ { id: 'no-value', name: this.getStatebyCode( country, state ) } ];
				}

				for ( const city of citiesAll ) {
					cities.push( { id: Utils.formatUrlString( city.name ), name: city.name } );
				}
			}

			return cities;

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

	getAllCountries ( lang?: string ): ICountry[] {

		try {

			const countriesEn = Country.getAllCountries();
			let countries: ICountry[] = countriesEn;

			i18nIsoCountries.registerLocale( require( `i18n-iso-countries/langs/${ lang ? lang : 'es' }.json` ) );
			countries.map( country => country.name = i18nIsoCountries.getName( country.isoCode, lang ? lang : 'es' ) );

			return countries.sort( ( a, b ) => ( a.name > b.name ) ? 1 : ( ( b.name > a.name ) ? -1 : 0 ) );

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

	getStatesByCountry ( countryIso: string ): StateInterface[] {

		try {

			let states: StateInterface[] = [];

			if ( countryIso === 'ES' ) {

				const statesEs: any[] = getProvinces();
				if ( !statesEs || statesEs.length === 0 ) return [];
				statesEs.forEach( state => states.push( { id: state.code, name: Utils.capitalize( state.name ) } ) );

			} else {

				const statesAll: IState[] = State.getStatesOfCountry( countryIso );
				if ( !statesAll || statesAll.length === 0 ) {
					states = [ { id: 'no-value', name: this.getCountryByCode( countryIso ) } ];
				}

				statesAll.forEach( state => states.push( { id: state.isoCode, name: state.name } ) );

			}

			return states;

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}

	getCityByCode ( country: string | undefined, state: string | undefined, city: string | undefined ): string | any {

		try {

			if ( !country || !state || !city ) { return '' }

			country = country.toUpperCase();
			state = state.toUpperCase();

			const cities = this.getCitiesByCountryAndState( country, state );

			if ( !cities || cities.length === 0 ) {
				return '';
			};

			for ( const cityArr of cities ) {
				if ( Utils.formatUrlString( city ) === Utils.formatUrlString( cityArr.id ) ) {
					return ( cityArr.name );
				}
			}

			return '';

		} catch ( error ) {
			throw new InternalServerErrorException();
		}

	}






}
