import {
	BadRequestException,
	Body,
	Controller, Get,
	HttpCode, Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CartService } from '../cart/cart.service';
import { Types } from 'mongoose';
import { UserCartService } from './user-cart/user-cart.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly cartService: CartService,
		private readonly userCartService: UserCartService
		) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.login);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR); // кор. запись от HttpException
		}
		const user = await this.authService.createUser(dto);
		await this.cartService.create(user._id);
		return user;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		const { login, password } = dto;
		// Если будет exception, то он поднимется наверх из validateUser и отработает
		const user: { email: string, _id: Types.ObjectId } = await this.authService.validateUser(login, password);
		return this.authService.login(user.email, user._id);
	}

	@Get('cart/:userId')
	async getCartById(@Param('userId') id: string) {
		return this.userCartService.getProductsById(id);
	}
}
