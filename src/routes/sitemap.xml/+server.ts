import { site } from '$lib/site';
import { bookPath, liveTales, storyPath, tales } from '$lib/tales/data';

export const prerender = true;

/**
 * 콘텐츠가 바뀌지 않았는데 lastmod가 갱신되면 크롤러 신뢰도만 떨어진다.
 * 빌드 시각을 쓰지 않고, 원고를 고친 날짜를 손으로 올린다.
 */
const CONTENT_UPDATED = '2026-09-11';

type Entry = { path: string; priority: string; lastmod: string };

const entries: Entry[] = [
	{ path: '/', priority: '1.0', lastmod: CONTENT_UPDATED },
	{ path: '/for-parents-and-teachers/', priority: '0.9', lastmod: CONTENT_UPDATED },
	{ path: '/about/', priority: '0.5', lastmod: CONTENT_UPDATED },

	// 이야기 전문. 검색 유입의 주력이라 가장 높은 우선순위를 준다.
	...tales.map((tale) => ({
		path: storyPath(tale),
		priority: '0.9',
		lastmod: tale.liveDate ?? CONTENT_UPDATED
	})),

	// 상품 페이지. 라이브 도서만 존재한다.
	...liveTales.map((tale) => ({
		path: bookPath(tale),
		priority: '0.7',
		lastmod: tale.liveDate ?? CONTENT_UPDATED
	}))
];

export function GET() {
	const urls = entries
		.map(
			(entry) =>
				`<url><loc>${site.url}${entry.path}</loc>` +
				`<lastmod>${entry.lastmod}</lastmod>` +
				`<changefreq>monthly</changefreq>` +
				`<priority>${entry.priority}</priority></url>`
		)
		.join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>` +
			`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
}
