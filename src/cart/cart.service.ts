import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CartModel } from './cart.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
	constructor(@InjectModel(CartModel) private readonly cartModel: ModelType<CartModel>) {
	}

	async create(userId: Types.ObjectId) {
		return this.cartModel.create({ userId });
	}

	async addToCart(userId: string, productId: string) {

		return this.cartModel
			.updateOne(
				{ userId: userId },
				// TODO: протестить $addToSet вместо пуша
				{ $push: { products: { productId: new Types.ObjectId(productId) } } }
			)
			.exec();
	}

	async findByUserId(userId: string) {
		return this.cartModel.findOne({ userId });
	}
}
