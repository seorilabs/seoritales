import { site } from '$lib/site';
import { absoluteUrl } from '$lib/seo/urls';
import { bookPath, coverPath, editionUrl, isPublished, series, storyPath } from '$lib/tales/data';
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

/** 작품과 판매 판본을 구분한다. ASIN은 실제 소매 재고를 증명하지 않는다. */
export function bookSchema(tale: Tale) {
	const path = absoluteUrl(bookPath(tale));
	const ebook = editionUrl(tale, 'ebook');
	const paperback = editionUrl(tale, 'paperback');
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
		image: absoluteUrl(coverPath(tale)),
		url: absoluteUrl(bookPath(tale)),
		isPartOf: { '@type': 'BookSeries', name: series.name },
		typicalAgeRange: tale.ageRange,
		workExample: [
			...(ebook
				? [
						{
							'@type': 'Book',
							'@id': `${path}#ebook`,
							bookFormat: 'https://schema.org/EBook',
							url: ebook,
							identifier: { '@type': 'PropertyValue', propertyID: 'ASIN', value: tale.asinEbook }
						}
					]
				: []),
			...(paperback
				? [
						{
							'@type': 'Book',
							'@id': `${path}#paperback`,
							bookFormat: 'https://schema.org/Paperback',
							url: paperback,
							numberOfPages: tale.interiorPages,
							identifier: {
								'@type': 'PropertyValue',
								propertyID: 'ASIN',
								value: tale.asinPaperback
							},
							...(tale.isbn13Paperback ? { isbn: tale.isbn13Paperback } : {})
						}
					]
				: [])
		]
	};
}

/** 이야기 전문 페이지. 그림책 본문은 창작물이므로 CreativeWork로 표기한다. */
export function storySchema(tale: Tale, path: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ShortStory',
		'@id': `${absoluteUrl(path)}#story`,
		name: tale.title,
		alternateName: tale.koreanTitle,
		url: absoluteUrl(path),
		inLanguage: 'en',
		genre: 'Korean folktale',
		typicalAgeRange: tale.ageRange,
		author: { '@type': 'Organization', name: series.author },
		publisher: { '@id': ORGANIZATION_ID },
		...(isPublished(tale) ? { isPartOf: { '@id': `${absoluteUrl(bookPath(tale))}#book` } } : {}),
		isBasedOn: {
			'@type': 'CreativeWork',
			name: tale.koreanTitle,
			description: 'Traditional Korean folktale in the public domain.'
		}
	};
}

export function storyListSchema(tales: Tale[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Korean folktales to read aloud',
		itemListElement: tales.map((tale, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: tale.title,
			url: absoluteUrl(storyPath(tale))
		}))
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
