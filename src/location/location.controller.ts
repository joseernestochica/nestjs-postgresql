import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';

@ApiTags( 'Location' )
@Controller( 'location' )
export class LocationController {

	constructor (
		private readonly locationService: LocationService
	) { }

	@Get( 'countries' )
	getAllCountries (
		@Query( 'lang' ) lang?: string,
	) {

		return {
			message: 'list of countries',
			statusCode: 200,
			data: { countries: this.locationService.getAllCountries( lang ) }
		};

	}

	@Get( 'country' )
	getCountryByCode (
		@Query( 'lang' ) lang?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return {
			message: 'Country by code',
			statusCode: 200,
			data: { country: this.locationService.getCountryByCode( countryIso, lang ) }
		};

	}

	@Get( 'states' )
	getStatesByCountry (
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return {
			message: 'States by country',
			statusCode: 200,
			data: { states: this.locationService.getStatesByCountry( countryIso ? countryIso.toUpperCase() : 'ES' ) }
		};

	}

	@Get( 'state' )
	getStatebyCode (
		@Query( 'state_id' ) stateId?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return {
			message: 'State by code',
			statusCode: 200,
			data: { cities: this.locationService.getStatebyCode( countryIso, stateId ) }
		};

	}

	@Get( 'cities' )
	getCitiesByCountryAndState (
		@Query( 'state_id' ) stateId?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return {
			message: 'list of cities by country and state',
			statusCode: 200,
			data: { cities: this.locationService.getCitiesByCountryAndState( countryIso, stateId ) }
		};

	}

	@Get( 'city' )
	getCitybyCode (
		@Query( 'state_id' ) stateId?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
		@Query( 'city_id' ) cityId?: string | undefined,
	) {

		return {
			message: 'City by code',
			statusCode: 200,
			data: { city: this.locationService.getCityByCode( countryIso, stateId, cityId ) }
		};

	}

}
