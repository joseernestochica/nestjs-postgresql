import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MessageWsService {

	private connectedClients: ConnectedClients = {};
	constructor (
		@InjectRepository( User )
		private readonly userRepository: Repository<User>
	) { }

	private checkUserConnection ( user: User ): void {

		for ( const clientId in this.connectedClients ) {

			const connectedClient = this.connectedClients[ clientId ];

			if ( connectedClient.user.id === user.id ) {
				connectedClient.socket.disconnect();
				break;
			}

		}

	}

	async registerClient ( client: Socket, userId: string ) {

		const user = await this.userRepository.findOneBy( { id: userId } );
		if ( !user ) { throw new Error( 'User not found' ); }
		if ( !user.isActive ) { throw new Error( 'User not activated' ); }

		this.checkUserConnection( user );

		this.connectedClients[ client.id ] = {
			socket: client,
			user
		};

	}

	unregisterClient ( clientId: string ) {

		delete this.connectedClients[ clientId ];

	}

	getConnectedClients (): string[] {

		return Object.keys( this.connectedClients );

	}

	getUserFullNameBySocketId ( socketId: string ): string {

		const client = this.connectedClients[ socketId ];
		return client ? client.user.fullName : '';

	}

}

interface ConnectedClients {
	[ id: string ]: {
		socket: Socket;
		user: User;
	};
}
