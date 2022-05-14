import { TopLevelCategory } from '../top-page/top-page.model';

type routeMapType = Record<TopLevelCategory, string>

const CATEGORY_URL = {
	0: '/coursers',
	1: '/services',
	2: '/books',
	3: '/products'
}

export { CATEGORY_URL };