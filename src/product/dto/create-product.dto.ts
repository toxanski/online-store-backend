import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductCharacteristicDto {
	@IsString()
	name: string;

	@IsString()
	value: string;
}

class CreateProductDto {
	@IsString()
	image: string;

	@IsString()
	title: string;

	@IsNumber()
	price: number;

	@IsNumber()
	oldPrice: number;

	@IsNumber()
	credit: number;

	// рассчитаю с помощью агрегаций
	// calculateRating: number;

	@IsString()
	description: string;

	@IsString()
	advantages: string;

	@IsString()
	disAdvantages: string;

	@IsArray()
	// each -> каждый перебираемый элемент - строка
	@IsString({ each: true })
	categories: string[];

	@IsArray()
	@IsString({ each: true })
	tags: string[];

	@IsArray()
	// валидация внутренних объектов(ProductCharacteristicDto)
	@ValidateNested()
	@Type(() => ProductCharacteristicDto)
	characteristics: ProductCharacteristicDto[]
}

export { CreateProductDto };