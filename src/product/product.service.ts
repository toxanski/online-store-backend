import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { ReviewModel } from '../review/review.model';
import { FindProductDto } from './dto/find-product.dto';

@Injectable()
export class ProductService {
	constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {}

	async create(dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
		return this.productModel.create(dto);
	}

	async findProductById(id: string): Promise<DocumentType<ProductModel>> {
		return this.productModel.findById(id).exec();
	}

	async delete(id: string) {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateProductById(id: string, dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
		// методы update у монги возвращают Предыдущую версию документа,
		// но на фронте хотелось бы получить уже обновленную
		return this.productModel.findByIdAndUpdate(id, dto, {new: true}).exec();
	}

	async findProductsWithReviews(dto: FindProductDto) {
		return await this.productModel
			.aggregate([
				{
					$match: {categories: dto.category}
				},
				{
					$sort: { _id: 1 }
				},
				{
					$limit: dto.limit
				},
				{
					$lookup: {
						from: 'Review',
						localField: '_id',
						foreignField: 'productId',
						as: 'reviews'
					}
				},
				{
					$addFields: {
						reviewCount: {$size: '$reviews'},
						reviewAvg: {$avg: '$reviews.rating'},
						// перезапись $reviews
						reviews: {
							// фнкция сортировки reviews(от новых к старым)
							$function: {
								body: `function (reviews) {
									reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
									return reviews;
								}`,
								args: ['$reviews'],
								lang: 'js'
							}
						}
					}
				}
			])
			// типизация у mongoose хромает(переделал из Promise<any>)
			.exec() as unknown as (ProductModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[]
	}
}
