import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./";

@Entity( 'refresh-tokens' )
export class RefreshToken {

	@PrimaryGeneratedColumn()
	id?: number;

	@Column( { type: 'varchar', nullable: false, length: '64' } )
	token: string;

	@CreateDateColumn( { type: 'timestamp', nullable: false } )
	created: Date;

	@CreateDateColumn( { type: 'timestamp', nullable: false } )
	expires: Date;

	@Column( { type: 'varchar', nullable: true, length: '30' } )
	ip?: string;

	@ManyToOne( ( type ) => User, ( user ) => user.id, {
		onDelete: 'CASCADE', eager: true
	} )
	// @JoinColumn( { name: 'userId' } )
	user: User;

}