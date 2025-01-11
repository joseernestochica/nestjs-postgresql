import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './';

@Entity( {
	name: 'user_images'
} )
export class UserImage {

	@PrimaryGeneratedColumn()
	id: number;

	@Column( 'text' )
	url: string;

	@ManyToOne(
		() => User,
		( user ) => user.images,
		{ onDelete: 'CASCADE' }
	)
	user: User;

} 