import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TopPageModule } from '../top-page/top-page.module';

@Module({
	imports: [TopPageModule, ConfigModule],
	controllers: [SitemapController]
})
export class SitemapModule {}
