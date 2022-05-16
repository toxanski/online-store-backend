import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ITelegramModuleAsyncOptions } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.consts';

// глобальный модуль
@Global()
// forRootAsync() - возвращает нужный конфиг этого модуля
@Module({
	// providers: [TelegramService],
	// exports: [TelegramService]
})
export class TelegramModule {
	// forRoot, forRootAsync подразумевается, что этот модуль
	// будет импортироваться в AppModule и достпен для всех др. модулей без импорта
	// распространяясь на все приложение
	static forRootAsync(options: ITelegramModuleAsyncOptions): DynamicModule {
		// создание ассинхронных опций в кач-ве провайдера,
		// чтобы в любом месте достать его по токену: TELEGRAM_MODULE_OPTIONS
		const asyncOptionsProvider = this.createAsyncOptionsProvider(options);

		return {
			module: TelegramModule,
			imports: options.imports,
			providers: [TelegramService, asyncOptionsProvider],
			exports: [TelegramService]
		};
	};

	// возврат провайдера ч/з factory
	private static createAsyncOptionsProvider(options: ITelegramModuleAsyncOptions): Provider {
		return {
			provide: TELEGRAM_MODULE_OPTIONS,
			useFactory: async (...args: any[]) => {
				// исполнение factory, которую передали ранее в опциях
				const config = await options.useFactory(...args);
				return config;
			},
			// внедрение необходимых зависимостей для factory
			inject: options.inject || []
		}
	}
}
