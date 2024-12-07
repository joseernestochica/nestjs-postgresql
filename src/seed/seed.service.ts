import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities';

@Injectable()
export class SeedService {

  constructor (

    private readonly productService: ProductsService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>,

  ) { }

  private async deleteDataTables () {

    await this.productService.removeAllProducts();

    const query = this.userRepository.createQueryBuilder( 'user' );
    await query.delete().execute();

  }

  private async insertAllUsers (): Promise<User> {

    const seedUsers = initialData.users;

    const users: User[] = [];
    for ( const seedUser of seedUsers ) {
      users.push( this.userRepository.create( seedUser ) );
    }

    await this.userRepository.save( users );
    return users[ 0 ];


  }

  private async insertAllProducts ( firstUser: User ) {

    await this.productService.removeAllProducts();
    const products = initialData.products;

    const promises = [];
    for ( const product of products ) {

      promises.push( this.productService.create( product, firstUser ) );

    }

    await Promise.all( promises );

  }

  async runSeed () {

    await this.deleteDataTables();
    const firstUser = await this.insertAllUsers();
    await this.insertAllProducts( firstUser );

    return { message: 'Seed executed' };

  }

}
