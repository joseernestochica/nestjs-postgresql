import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway( { cors: true } )
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor (
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection ( client: Socket ) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload

    try {

      payload = this.jwtService.verify( token );
      if ( !payload ) { throw new Error( 'Invalid token' ); }

      await this.messageWsService.registerClient( client, payload.id );

    }
    catch ( error ) {
      client.disconnect();
      return;
    }

    this.server.emit( 'clients-updated', this.messageWsService.getConnectedClients() );

  }

  handleDisconnect ( client: Socket ) {

    this.messageWsService.unregisterClient( client.id );

    this.server.emit( 'clients-updated', this.messageWsService.getConnectedClients() );

  }

  @SubscribeMessage( 'message' )
  handleMessage ( client: Socket, payload: NewMessageDto ) {

    // Emite solo al cliente que envio el mensaje
    // client.emit( 'message-from-server', {
    //   fullName: 'Yo',
    //   message: payload.message
    // } );

    // Emite a todos excepto el cliente que envio el mensaje
    // client.broadcast.emit( 'message-from-server', {
    //   fullName: 'Yo',
    //   message: payload.message
    // } );

    // Emite a todos os clientes conectados
    this.server.emit( 'message-from-server', {
      fullName: this.messageWsService.getUserFullNameBySocketId( client.id ),
      message: payload.message
    } );

  }

}
