import { prop } from '@typegoose/typegoose';

export class CreateReviewDto {
	name: string;
	title: string;
	description: string;
	rating: number;
	productId: string
}