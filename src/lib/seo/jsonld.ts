import { site } from '$lib/site';
import { absoluteUrl } from '$lib/seo/urls';
import { bookPath, coverPath, series } from '$lib/tales/data';
import type { Tale } from '$lib/tales/types';

export const ORGANIZATION_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORGANIZATION_ID,
		name: site.publisher,
		alternateName: site.name,
		url: `${site.url}/`,
		email: site.email
	};
}

export function webSiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: site.name,
		url: `${site.url}/`,
		inLanguage: 'en',
		publisher: { '@id': ORGANIZATION_ID }
	};
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	};
}

/**
 * 책 한 권. offers는 ASIN이 있을 때만 넣는다 — 가격만 있고 살 수 없는 상품은
 * 구조화 데이터 위반이다.
 */
export function bookSchema(tale: Tale, buyUrl: string | null) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Book',
		'@id': `${absoluteUrl(bookPath(tale))}#book`,
		name: tale.title,
		alternateName: tale.koreanTitle,
		description: tale.backBlurb,
		author: { '@type': 'Organization', name: series.author },
		publisher: { '@id': ORGANIZATION_ID },
		inLanguage: 'en',
		bookFormat: 'https://schema.org/EBook',
		numberOfPages: tale.interiorPages,
		image: absoluteUrl(coverPath(tale)),
		url: absoluteUrl(bookPath(tale)),
		isPartOf: { '@type': 'BookSeries', name: series.name },
		typicalAgeRange: tale.ageRange,
		...(tale.isbn13Paperback ? { isbn: tale.isbn13Paperback } : {}),
		...(buyUrl
			? {
					offers: {
						'@type': 'Offer',
						price: tale.priceEbookUsd.toFixed(2),
						priceCurrency: 'USD',
						availability: 'https://schema.org/InStock',
						url: buyUrl
					}
				}
			: {})
	};
}

/** 이야기 전문 페이지. 그림책 본문은 창작물이므로 CreativeWork로 표기한다. */
export function storySchema(tale: Tale, path: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ShortStory',
		name: tale.title,
		alternateName: tale.koreanTitle,
		url: absoluteUrl(path),
		inLanguage: 'en',
		genre: 'Korean folktale',
		typicalAgeRange: tale.ageRange,
		author: { '@type': 'Organization', name: series.author },
		publisher: { '@id': ORGANIZATION_ID },
		isBasedOn: {
			'@type': 'CreativeWork',
			name: tale.koreanTitle,
			description: 'Traditional Korean folktale in the public domain.'
		}
	};
}

export function seriesListSchema(tales: Tale[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BookSeries',
		name: series.name,
		url: `${site.url}/`,
		inLanguage: 'en',
		publisher: { '@id': ORGANIZATION_ID },
		hasPart: tales.map((tale) => ({
			'@type': 'Book',
			name: tale.title,
			url: absoluteUrl(bookPath(tale)),
			position: tale.number
		}))
	};
}
