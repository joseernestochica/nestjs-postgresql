import { Product } from 'src/products/entities';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { RefreshToken } from './';
import * as bcrypt from 'bcrypt';
import { UserImage } from './user-image.entity';

@Entity( 'users' )
export class User {

	@PrimaryGeneratedColumn( 'uuid' )
	id: string;

	@Column( 'text', { unique: true } )
	email: string;

	@Column( 'text' )
	password: string;

	@Column( 'text' )
	fullName: string;

	@Column( 'bool', { default: true } )
	isActive: boolean;

	@Column( 'bool', { default: false } )
	isDeleted: boolean;

	@Column( 'text', { array: true, default: [ 'user' ] } )
	roles: string[];

	@OneToMany(
		() => Product,
		( product ) => product.user
	)
	product: Product;

	@OneToMany(
		() => RefreshToken,
		( refreshToken ) => refreshToken.user
	)
	refreshToken: RefreshToken;

	@OneToMany(
		() => UserImage,
		( userImage ) => userImage.user
	)
	images: UserImage[];

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
