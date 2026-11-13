import { attributionUrls } from './attribution';
import bundle from './tales.json';
import type { Tale, TalesBundle } from './types';
import { teachingNotes } from './teaching';

const data = bundle as TalesBundle;

export const series = data.series;
export const tales = data.books;

export const taleBySlug = new Map(tales.map((tale) => [tale.slug, tale]));

/** 실제로 아마존에 올라간 책만. 상품 페이지는 이것만 만든다. */
export const isPublished = (tale: Tale) =>
	(tale.statusEbook === 'live' && Boolean(tale.asinEbook)) ||
	(tale.statusPaperback === 'live' && Boolean(tale.asinPaperback)) ||
	tale.storeLinks.length > 0;
export const liveTales = tales.filter(isPublished);
export const freeTales = tales.filter((tale) => tale.webPublication.mode === 'full');

for (const tale of tales) {
	const note = teachingNotes[tale.slug];
	if (!note) throw new Error(`teaching: ${tale.slug} 편집 원고가 없습니다`);
	if (note.related.some((slug) => slug === tale.slug || !taleBySlug.has(slug))) {
		throw new Error(`teaching: ${tale.slug} 관련 이야기 주소를 확인하세요`);
	}
}

/** 공개 범위는 원본 exporter에서 적용한다. 비공개 본문은 번들에 넣지 않는다. */
export const isPreview = (tale: Tale) => tale.webPublication.mode === 'preview';
export const visibleStory = (tale: Tale) => tale.story;
export const showsBookExtras = (tale: Tale) => !isPreview(tale);

/** 'October 4, 2026' 처럼 읽히는 형태로. */
export function formatDate(iso: string): string {
	return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

/**
 * Attribution 링크와 원장이 어긋나면 조용히 엉뚱한 책의 매출로 집계된다.
 * 빌드 때 한 번 확인하고, 틀리면 prerender 를 실패시킨다.
 */
for (const [slug, url] of Object.entries(attributionUrls)) {
	const tale = taleBySlug.get(slug);
	if (!tale) throw new Error(`attribution: 알 수 없는 slug "${slug}"`);
	if (!tale.asinEbook || !url.includes(`/dp/${tale.asinEbook}`)) {
		throw new Error(`attribution: "${slug}" 링크가 ASIN ${tale.asinEbook} 과 다릅니다 -> ${url}`);
	}
}

/**
 * 책의 구매 링크. Attribution 링크가 있으면 그것을 쓴다 — 외부 유입 추적과
 * Brand Referral Bonus 가 거기에 달려 있다. 없으면 일반 상품 링크로 떨어진다.
 * ASIN 자체가 없으면 null 이고, 호출부가 링크를 숨긴다.
 */
export function buyUrl(tale: Tale): string | null {
	return (
		editionUrl(tale, 'ebook') ?? editionUrl(tale, 'paperback') ?? tale.storeLinks[0]?.url ?? null
	);
}

export function editionUrl(tale: Tale, format: 'ebook' | 'paperback'): string | null {
	if (format === 'ebook') {
		return tale.statusEbook === 'live' && tale.asinEbook
			? (attributionUrls[tale.slug] ?? `https://www.amazon.com/dp/${tale.asinEbook}`)
			: null;
	}
	return tale.statusPaperback === 'live' && tale.asinPaperback
		? `https://www.amazon.com/dp/${tale.asinPaperback}`
		: null;
}

export const storyPath = (tale: Tale) => `/stories/${tale.slug}/`;
export const bookPath = (tale: Tale) => `/books/${tale.slug}/`;
export const coverPath = (tale: Tale) => `/images/${tale.slug}/cover.webp`;
export const ogPath = (tale: Tale) => `/images/${tale.slug}/og.jpg`;
export const spreadPath = (tale: Tale, spread: string) => `/images/${tale.slug}/${spread}.webp`;

/** 소리 내어 읽는 속도(분당 약 130단어)로 계산한 읽기 시간. */
export function readAloudMinutes(tale: Tale): number {
	return tale.readAloudMinutes;
}
