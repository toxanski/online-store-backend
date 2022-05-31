import { Controller, Get, Header } from '@nestjs/common';
import { TopPageService } from '../top-page/top-page.service';
import { ConfigService } from '@nestjs/config';
import { Builder } from 'xml2js';
import { format, subDays } from 'date-fns';
import { CATEGORY_URL } from './sitemap.consts';

@Controller('sitemap')
export class SitemapController {
	domain:string;

	constructor(
		private readonly topPageService: TopPageService,
		private readonly configService: ConfigService
	) {
		this.domain = this.configService.get('DOMAIN') ?? '';
	}

	// роботы получают инфу get запросом
	@Get('xml')
	@Header('content-type', 'text/xml')
	async sitemap() {
		//пр. 1997-07-16T19:20:00.000+03:00
		const dateFormatString = 'yyyy-MM-dd\'T\'HH:mm:00.000xxx';
		let res = [
			{
				loc: this.domain,
				// subDays(new Date(), 1) - вчерашняя дата
				lastmod: format(subDays(new Date(), 1), dateFormatString),
				changefreq: 'daily',
				priority: '1.0'
			},
			{
				loc: `${this.domain}/courses`,
				lastmod: format(subDays(new Date(), 1), dateFormatString),
				changefreq: 'daily',
				priority: '1.0'
			}
		];
		const pages = await this.topPageService.findAll();
		res = res.concat(pages.map(page => {
			return {
				loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
				lastmod: format(new Date(page.updatedAt), dateFormatString),
				changefreq: 'weekly',
				priority: '0.7'
			}
		}))

		const builder = new Builder({
			xmldec: { version: '1.0', encoding: 'UTF-8' }
		});

		return builder.buildObject({
			urlset: {
				$: { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" },
				url: res
			}
		})
	}
}
