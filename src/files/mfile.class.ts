// от Express.Multer.File;
// для работы saveFiles(), когда convertToWebP() возвращает буффер
// и как-то надо дальше работать с этим буффером в saveFiles()
// Express.Multer.File и MFile обратно совместимы
export class MFile {
	originalname: string
	buffer: Buffer

	constructor(file: Express.Multer.File | MFile) {
		this.buffer = file.buffer;
		this.originalname = file.originalname;
	}
}