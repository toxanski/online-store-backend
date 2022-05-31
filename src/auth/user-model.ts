import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface CartItem {
	productId: string;
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({
		unique: true
	})
	email: string;

	@prop()
	passwordHash: string;
}

export interface ValidateResponse {
	_id: Types.ObjectId;
	email: string;
}
