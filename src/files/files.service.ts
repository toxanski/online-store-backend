import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FilesService {
	async saveFiles(files: Express.Multer.File[]) {
		const dateNameFolder = format(new Date(), 'yyyy-MM-dd');
		const uploadFolderPath = `${path}/uploads/${dateNameFolder}`;
		// из fs-extra; проверка на сущ-ие папки, иначе создание этой папки
		await ensureDir(uploadFolderPath);

		// запись файла в dir и генерация ответа
		const response: FileElementResponse[] = [];
		for (let file of files) {
			await writeFile(`${uploadFolderPath}/${file.originalname}`, file.buffer);
			response.push({
				url: `${dateNameFolder}/${file.originalname}`,
				name: file.originalname
			});
		}
		return response;
	}
}
