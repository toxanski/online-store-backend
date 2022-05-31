import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// class ProductItem {
// 	@IsString()
// 	productId: string;
// }
//
// export class AddProductsDto {
// 	@IsArray()
// 	@ValidateNested()
// 	@Type(() => ProductItem)
// 	products: ProductItem[];
// }

export class AddProductDto {
	productId: string;
}