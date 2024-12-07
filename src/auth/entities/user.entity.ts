import { Product } from 'src/products/entities';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity( 'users' )
export class User {

	@PrimaryGeneratedColumn( 'uuid' )
	id: string;

	@Column( 'text', { unique: true } )
	email: string;

	@Column( 'text', { select: false } )
	password: string;

	@Column( 'text' )
	fullName: string;

	@Column( 'bool', { default: true } )
	isActive: boolean;

	@Column( 'text', { array: true, default: [ 'user' ] } )
	roles: string[];

	@OneToMany(
		() => Product,
		( product ) => product.user
	)
	product: Product;

	@BeforeInsert()
	@BeforeUpdate()
	emailToLowerCase () {
		this.email = this.email.toLowerCase().trim();
	}

	@BeforeInsert()
	hashPassword () {
		this.password = bcrypt.hashSync( this.password, 10 );
	}

}
