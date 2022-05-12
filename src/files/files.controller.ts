import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
		// 1) Сначало сохранили в массив оригинальный file.[jpeg, png, ...]
		// 2) После сохранили в формате в .webp
		const saveFilesArray: MFile[] = [
			new MFile(file)
			// либо просто file, т.к. он имеет тип Express.Multer.File(= MFile)
		];

		console.log(file);
		if (file.mimetype.includes('image')) {
			const imageBuffer = await this.filesService.convertToWebP(file.buffer);
			saveFilesArray.push(new MFile({
				originalname: `${file.originalname.split('.')[0]}.webp`,
				buffer: imageBuffer
			}));
		}
		return this.filesService.saveFiles(saveFilesArray);
	}
}
