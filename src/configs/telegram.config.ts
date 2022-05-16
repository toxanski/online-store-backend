import { ITelegramOptions } from '../telegram/telegram.interface';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
	const token = configService.get('TELEGRAM_TOKEN2');
	if (!token) throw new Error('TELEGRAM_TOKEN не задан');

	return {
		chatId: configService.get('TELEGRAM_CHAT_ID2') ?? '',
		token
	};
};