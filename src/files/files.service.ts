import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
	async saveFiles(files: MFile[]) {
		// генерация названия dir
		const dateNameFolder = format(new Date(), 'yyyy-MM-dd');
		// путь dir
		const uploadFolderPath = `${path}/uploads/${dateNameFolder}`;
		// из fs-extra; проверка на сущ-ие папки, иначе создание этой папки
		await ensureDir(uploadFolderPath);

		// запись файла в dir и генерация ответа
		const response: FileElementResponse[] = [];
		for (let file of files) {
			// file.originalname из типа Express.Multer.File
			await writeFile(`${uploadFolderPath}/${file.originalname}`, file.buffer);
			response.push({
				url: `${dateNameFolder}/${file.originalname}`,
				name: file.originalname
			});
		}
		return response;
	}

	convertToWebP(file: Buffer): Promise<Buffer> {
		return sharp(file)
			.webp()
			.toBuffer()
	}
}
