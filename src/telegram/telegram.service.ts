import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.consts';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: ITelegramOptions;

	constructor(
		// options конфигурируются из импорта TelegramModule в AppModule( getTelegramConfig() )
		@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions
	) {
		this.bot = new Telegraf(options.token);
		this.options = options;
	}

	async sendMessage(message: string, chatId: string = this.options.chatId) {
		console.log('message = ', message);
		console.log(chatId);
		await this.bot.telegram.sendMessage(chatId, message);
	}

}
