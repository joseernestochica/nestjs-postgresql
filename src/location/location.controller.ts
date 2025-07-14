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

		return this.locationService.getAllCountries( lang );

	}

	@Get( 'country' )
	getCountryByCode (
		@Query( 'lang' ) lang?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return this.locationService.getCountryByCode( countryIso, lang );

	}

	@Get( 'states' )
	getStatesByCountry (
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return this.locationService.getStatesByCountry( countryIso ? countryIso.toUpperCase() : 'ES' );

	}

	@Get( 'state' )
	getStatebyCode (
		@Query( 'state_id' ) stateId?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return this.locationService.getStatebyCode( countryIso, stateId );

	}

	@Get( 'cities' )
	getCitiesByCountryAndState (
		@Query( 'state_id' ) stateId?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
	) {

		return this.locationService.getCitiesByCountryAndState( countryIso, stateId );

	}

	@Get( 'city' )
	getCitybyCode (
		@Query( 'state_id' ) stateId?: string | undefined,
		@Query( 'country_iso' ) countryIso?: string | undefined,
		@Query( 'city_id' ) cityId?: string | undefined,
	) {

		return this.locationService.getCityByCode( countryIso, stateId, cityId );

	}

}
