import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserModel, ValidateResponse } from './user-model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/auth.dto';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async createUser(dto: AuthDto) {
		const salt = genSaltSync(10);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: hashSync(dto.password, salt)
		});
		// console.log(newUser);
		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}
	// createUser, findUser лучше вынести в отд. сервис,
	// но авторизация небольшая поэтому оставлю

	async validateUser(email: string, password: string): Promise<ValidateResponse> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword: boolean = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		return { email: user.email, _id: user._id };
	}

	// email передал, чтобы отрисовать его в интерфейсе(можно передать всё что угодно)
	async login(email: string, _id: Types.ObjectId) {
		// для корректного токена нужен object
		const payload = { email, _id };
		return {
			access_token: await this.jwtService.signAsync(payload)
		};
	}

	async addProduct() {

	}
}
