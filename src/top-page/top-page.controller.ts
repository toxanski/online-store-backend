import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post, UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { PAGE_NOT_FOUND_ERROR } from './top-page.consts';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService
		) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id') id: string) {
		const page = await this.topPageService.findPageById(id);
		if (!page) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
		return page;
	}

	@Get('byAlias/:alias')
	async findByAlias(@Param('alias') alias: string) {
		const page = await this.topPageService.findPageByAlias(alias);
		if (!page) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedPage = await this.topPageService.deletePage(id);
		if (!deletedPage) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
		const updatedPage = await this.topPageService.updatePage(id, dto);
		if (!updatedPage) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
		return updatedPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	// для формирования меню
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findPagesByCategory(dto.firstCategory);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
}
