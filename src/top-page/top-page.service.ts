import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { PAGE_NOT_FOUND_ERROR } from './top-page.consts';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { ProductModel } from '../product/product.model';

@Injectable()
export class TopPageService {
	constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
	}

	async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
		return this.topPageModel.create(dto);
	}

	async findPageById(id: string): Promise<DocumentType<TopPageModel> | null> {
		return this.topPageModel.findById(id).exec();
	}

	async findPageByAlias(alias: string): Promise<DocumentType<TopPageModel> | null> {
		return this.topPageModel.findOne({alias}).exec();
	}

	async findPagesByCategory(firstCategory: TopLevelCategory) {
		// вернет страницы по категории и только нужные в ней поля (secondCategory, alias и title)
		return this.topPageModel
			.aggregate()
			.match({ firstCategory: firstCategory })
			.group({
				_id: { secondCategory: '$secondCategory' },
				pages: { $push: { alias: '$alias', title: '$title' } }
			})
			// .aggregate([
			// 	{
			// 		$match: { firstCategory: firstCategory }
			// 	},
			// 	{
			// 		$group: {
			// 			_id: { secondCategory: '$secondCategory' },
			// 			pages: { $push: { alias: '$alias', title: '$title' } }
			// 		}
			// 	}
			// ])
			.exec();
	}

	async findByText(text: string) {
		return this.topPageModel.find({
			$text: { $search: text, $caseSensitive: false }
		});
	}

	async deletePage(id: string) {
		return this.topPageModel.findByIdAndRemove(id).exec();
	}

	async updatePage(id: string, dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
		return this.topPageModel
			.findByIdAndUpdate(id, dto, {new: true})
			.exec();
	}
}
