import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add-products.dto';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {
	}

	// @Post('add')
	// create() {
	// 	return this.cartService.create();
	// }

	@Post('add/:id')
	async addToCart(@Param('id') id: string, @Body() dto: AddProductDto) {
		return this.cartService.addToCart(id, dto.productId);
	}

	@Get('find/:userId')
	async getCartInfo(@Param('userId') id: string) {
		return this.cartService.findByUserId(id);
	}
}
