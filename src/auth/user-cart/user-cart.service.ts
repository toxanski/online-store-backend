import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../user-model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';

@Injectable()
export class UserCartService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {
	}

	async getProductsById(id: string) {
		return this.userModel.aggregate([
			{ $match: { _id: new Types.ObjectId(id) } },
			{
				$lookup: {
					from: 'Cart',
					pipeline: [
						{ $match: { userId: id } },
					],
					as: 'cart'
				}
			},
			{ $unwind: '$cart' }, // flatting
			{
				// только нужные поля
				$group: {
					_id: '$_id',
					// TODO: протестить $addToSet вместо пуша
					cart: { $push: '$cart' },
				}
			},
			{ $unwind: '$cart' }, // flatting 2
			{
				// исключение лишних полей
				$project: {
					'cart._id': 0,
					'cart.userId': 0,
				}
			},
			{
				$addFields: {
					// из-за массива обектов $size на cart криво работал

					// cartCount: {
					// 	$function: {
					// 		body: `function (cart) {
					// 			return cart.length;
					// 		}`,
					// 		args: ['$cart.products'],
					// 		lang: 'js'
					// 	}
					// },
					cartCount: { $size: '$cart.products' }
				}
			},
			// TODO: раскрыть ответ в виде [] из за lookup
		]).exec();
	}
}
