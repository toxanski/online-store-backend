import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class ProductCartItem {
	@prop()
	// productId: Types.ObjectId;
	productId: string;
}

export interface CartModel extends Base {}
export class CartModel extends TimeStamps {
	@prop({
		unique: true
	})
	userId: string;

	@prop({type: () => [ProductCartItem], _id: false})
	products: [ProductCartItem];
}