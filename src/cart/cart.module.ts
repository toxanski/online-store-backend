import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CartModel } from './cart.model';
import { UserModel } from '../auth/user-model';

@Module({
	controllers: [CartController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CartModel,
				schemaOptions: {
					collection: 'Cart'
				}
			}
		]),
	],
	providers: [CartService],
	exports: [CartService]
})
export class CartModule {
}
