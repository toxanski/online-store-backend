import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UsePipes, ValidationPipe
} from '@nestjs/common';
import {ProductModel} from './product.model';
import {FindProductDto} from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { NOT_FOUND_PRODUCT_ERROR } from './product.constants';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto);
	}

	@Get(':id')
	async get(@Param() id: string) {
		const product = await this.productService.findProductById(id);
		if (!product) {
			throw new NotFoundException(NOT_FOUND_PRODUCT_ERROR);
		}
		return product;
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedProduct = await this.productService.delete(id);
		if (!deletedProduct) {
			throw new NotFoundException(NOT_FOUND_PRODUCT_ERROR);
		}
		// просто 200
	}

	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: ProductModel) {
		const updatedProduct = await this.productService.updateProductById(id, dto);
		if (!updatedProduct) {
			throw new NotFoundException(NOT_FOUND_PRODUCT_ERROR);
		}
		return updatedProduct;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return this.productService.findProductsWithReviews(dto);
	}
}
