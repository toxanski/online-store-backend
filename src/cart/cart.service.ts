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
		// this.cartModel
		// .findOne({ userId: new Types.ObjectId(userId) })
		// .insertOne()
		console.log('userId: ', userId);
		console.log('productId: ', productId);
		// return this.cartModel.findOne({ userId });
		return this.cartModel
			// .updateMany(
			// 	{ userId },
			// 	{ $set:
			// 				{
			// 					products: [{ productId: new Types.ObjectId(productId) }]
			// 				}
			// 			 }
			// )
			// $addFields обновляет только products а не его вложенный массив
			.update(
				{ userId: userId },
				{$push: { products: { productId: new Types.ObjectId(productId) } } }
			)
			.exec();
	}

	async findByUserId(userId: string) {
		return this.cartModel.findOne({ userId });
	}
}
